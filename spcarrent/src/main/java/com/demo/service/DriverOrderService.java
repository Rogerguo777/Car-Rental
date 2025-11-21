package com.demo.service;

import java.util.List;

import com.demo.model.DriverOrder;

public interface DriverOrderService {
	DriverOrder createDorder(DriverOrder dorder);

	List<DriverOrder> findAll();

	List<DriverOrder> findDorderByPhone(String phone);
	
	public DriverOrder findByOrderNo(String orderNo);

	DriverOrder findById(Long id);
}
