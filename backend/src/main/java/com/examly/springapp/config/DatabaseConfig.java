package com.examly.springapp.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DB_HOST:localhost}")
    private String dbHost;

    @Value("${DB_PORT:5432}")
    private String dbPort;

    @Value("${DB_NAME:financedb}")
    private String dbName;

    @Value("${DB_USER:postgres}")
    private String dbUser;

    @Value("${DB_PASSWORD:1234}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String rawUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DATABASE_URL");
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        if (rawUrl != null && !rawUrl.isBlank()) {
            logger.info("Found database connection URL in environment: {}", maskUrl(rawUrl));
            try {
                if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
                    URI uri = new URI(rawUrl.replace("postgres://", "postgresql://"));
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    String database = (path != null && path.length() > 1) ? path.substring(1) : "financedb";

                    String userInfo = uri.getUserInfo();
                    if (userInfo != null && userInfo.contains(":")) {
                        String[] parts = userInfo.split(":", 2);
                        config.setUsername(parts[0]);
                        config.setPassword(parts[1]);
                    }

                    // On Render/cloud providers, SSL is required for PostgreSQL
                    String sslParam = isLocalhost(host) ? "" : "?sslmode=require";
                    String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s%s", host, port, database, sslParam);
                    config.setJdbcUrl(jdbcUrl);
                    logger.info("Configured JDBC URL: jdbc:postgresql://{}:{}/{}{}", host, port, database, sslParam);
                } else if (rawUrl.startsWith("jdbc:postgresql://")) {
                    config.setJdbcUrl(rawUrl);
                    String user = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : dbUser;
                    String pass = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : dbPassword;
                    config.setUsername(user);
                    config.setPassword(pass);
                } else {
                    config.setJdbcUrl("jdbc:" + rawUrl);
                }
            } catch (Exception e) {
                logger.error("Error parsing database URL, falling back to host/port/credentials", e);
                constructDefaultConfig(config);
            }
        } else {
            constructDefaultConfig(config);
        }

        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setIdleTimeout(30000);
        config.setConnectionTimeout(30000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }

    private void constructDefaultConfig(HikariConfig config) {
        String host = System.getenv("DB_HOST") != null ? System.getenv("DB_HOST") : dbHost;
        String port = System.getenv("DB_PORT") != null ? System.getenv("DB_PORT") : dbPort;
        String name = System.getenv("DB_NAME") != null ? System.getenv("DB_NAME") : dbName;
        String user = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : dbUser;
        String pass = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : dbPassword;

        String sslParam = isLocalhost(host) ? "" : "?sslmode=require";
        String jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s%s", host, port, name, sslParam);

        config.setJdbcUrl(jdbcUrl);
        config.setUsername(user);
        config.setPassword(pass);
        logger.info("Using JDBC connection to {}:{}/{} (sslmode={})", host, port, name, isLocalhost(host) ? "disable" : "require");
    }

    private boolean isLocalhost(String host) {
        return "localhost".equalsIgnoreCase(host) || "127.0.0.1".equals(host);
    }

    private String maskUrl(String url) {
        return url.replaceAll(":[^:@]+@", ":****@");
    }
}
