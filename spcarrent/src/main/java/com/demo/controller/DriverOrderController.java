package com.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.model.DriverOrder;
import com.demo.service.DriverOrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DriverOrderController {

	private final DriverOrderService driverOrderService;

	/**
	 * 建立新訂單
	 */
	@PostMapping
	public ResponseEntity<?> createOrder(@RequestBody DriverOrder dorder) {
		try {
			DriverOrder saved = driverOrderService.createDorder(dorder);
			return ResponseEntity.status(HttpStatus.CREATED).body(saved);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("建立訂單失敗：" + e.getMessage());
		}
	}

	/**
	 * 依電話查詢訂單
	 */
	@GetMapping("/phone/{phone}")
	public ResponseEntity<?> getOrdersByPhone(@PathVariable String phone) {
		List<DriverOrder> list = driverOrderService.findDorderByPhone(phone);
		if (list.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(list);
	}

	/**
	 * 查詢所有訂單
	 */
	@GetMapping
	public ResponseEntity<?> getAllOrders() {
		return ResponseEntity.ok(driverOrderService.findAll());
	}

	// 依 ID 查詢訂單
	@GetMapping("/{id}")
	public ResponseEntity<?> getOrderById(@PathVariable Long id) {
		DriverOrder order = driverOrderService.findById(id);
		if (order == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(order);
	}

	// 依 orderNo 查詢
	@GetMapping("/find/orderNo/{orderNo}")
	public ResponseEntity<?> getOrderByOrderNo(@PathVariable String orderNo) {
		DriverOrder order = driverOrderService.findByOrderNo(orderNo);

		if (order == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("查無此訂單：" + orderNo);
		}

		return ResponseEntity.ok(order);
	}
}
