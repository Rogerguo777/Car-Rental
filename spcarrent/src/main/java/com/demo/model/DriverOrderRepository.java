package com.demo.model;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverOrderRepository extends JpaRepository<DriverOrder, Long> {
	public List<DriverOrder> findByPhone(String phone);
	public Optional<DriverOrder> findByOrderNo(String orderNo);
}
