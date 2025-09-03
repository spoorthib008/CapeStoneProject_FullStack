package com.example.payroll;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.example")
@EnableJpaRepositories(basePackages = "com.example.repo")
@EntityScan(basePackages = "com.example.entity")
@EnableScheduling
public class PayRollManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(PayRollManagementApplication.class, args);
	}

}
