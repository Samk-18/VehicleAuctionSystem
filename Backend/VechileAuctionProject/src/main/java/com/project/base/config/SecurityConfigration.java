package com.project.base.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
@Configuration
public class SecurityConfigration {
    @Bean
		public ModelMapper modelMapper()
		{
			ModelMapper map=new ModelMapper();
			map.getConfiguration()
			.setMatchingStrategy(MatchingStrategies.STRICT)
			.setPropertyCondition(Conditions.isNotNull());
			return map;
		}
}

