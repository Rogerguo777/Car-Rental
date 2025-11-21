package com.demo.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.demo.model.ADSCar;
import com.demo.model.ADSCarRepository;
import com.demo.model.DriverOrder;
import com.demo.model.DriverOrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DriverOrderServiceImpl implements DriverOrderService {

	private final DriverOrderRepository driverOrderRepository;
	private final ADSCarRepository adscarRepository;

	@Override
	public DriverOrder createDorder(DriverOrder dorder) {
		// 確保 adscar 關聯存在（前端傳 adscar.adscarId）
		if (dorder.getAdscar() != null && dorder.getAdscar().getAdscarId() != null) {
			Long adscarId = dorder.getAdscar().getAdscarId();
			ADSCar car = adscarRepository.findById(adscarId).orElse(null);
			if (car == null) {
				throw new IllegalArgumentException("Adscar not found: " + adscarId);
			}
			dorder.setAdscar(car);
		} else {
			throw new IllegalArgumentException("Adscar (車輛) 必須提供");
		}
		long count = driverOrderRepository.count() + 1;
		String orderNo = String.format("ads%03d", count);
		dorder.setOrderNo(orderNo);
		// 可做額外的業務驗證，例如：日期/時間不可為過去
		// (根據你的需求加入)

		return driverOrderRepository.save(dorder);
	}

	@Override
	public List<DriverOrder> findAll() {
		return driverOrderRepository.findAll();
	}

	@Override
	public List<DriverOrder> findDorderByPhone(String phone) {
		return driverOrderRepository.findByPhone(phone);
	}

	@Override
	public DriverOrder findById(Long id) {
		return driverOrderRepository.findById(id).orElse(null);
	}

	@Override
	public DriverOrder findByOrderNo(String orderNo) {
		return driverOrderRepository.findByOrderNo(orderNo).orElse(null);
	}
}
