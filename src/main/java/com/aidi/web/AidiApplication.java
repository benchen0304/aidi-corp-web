package com.aidi.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication (exclude = { DataSourceAutoConfiguration.class })
public class AidiApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(AidiApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(AidiApplication.class);
	}
}
