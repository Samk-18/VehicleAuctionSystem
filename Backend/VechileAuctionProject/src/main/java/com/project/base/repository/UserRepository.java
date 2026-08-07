package com.project.base.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.base.pojo.User;

public interface UserRepository extends JpaRepository<User,Long> {
	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);


}
