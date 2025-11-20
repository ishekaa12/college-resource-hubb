package com.example.college_resource_hubb;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        
        // If DATABASE_URL is provided (Railway), parse it
        if (databaseUrl != null && !databaseUrl.isEmpty() && 
            (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
            try {
                URI dbUri = new URI(databaseUrl);
                
                String username = dbUri.getUserInfo().split(":")[0];
                String password = dbUri.getUserInfo().split(":")[1];
                String host = dbUri.getHost();
                int port = dbUri.getPort();
                String path = dbUri.getPath();
                String database = path.startsWith("/") ? path.substring(1) : path;
                
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
                
                properties.setUrl(jdbcUrl);
                properties.setUsername(username);
                properties.setPassword(password);
                properties.setDriverClassName("org.postgresql.Driver");
            } catch (URISyntaxException e) {
                throw new RuntimeException("Failed to parse DATABASE_URL: " + databaseUrl, e);
            }
        }
        // Otherwise, use defaults from application.properties (H2)
        
        return properties;
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}

