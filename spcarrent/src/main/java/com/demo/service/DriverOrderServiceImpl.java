package com.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.demo.model.ADSCar;
import com.demo.model.ADSCarRepository;
import com.demo.model.DriverOrder;
import com.demo.model.DriverOrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j // log.info
public class DriverOrderServiceImpl implements DriverOrderService {

	private final DriverOrderRepository driverOrderRepository;
	private final ADSCarRepository adscarRepository;

	@Override
	@Transactional
	public DriverOrder createDorder(DriverOrder dorder) {
		try {
			// 驗證並設定 ADSCar 關聯
			if (dorder.getAdscar() == null || dorder.getAdscar().getAdscarId() == null) {
				throw new IllegalArgumentException("車輛資訊（adscar）必須提供且含 adscarId");
			}
			Long adscarId = dorder.getAdscar().getAdscarId();
			ADSCar car = adscarRepository.findById(adscarId)
					.orElseThrow(() -> new IllegalArgumentException("指定的車輛不存在 (adscarId=" + adscarId + ")"));
			dorder.setAdscar(car);

			// 簡單業務驗證（可依需求開啟）
			/* java script 內已有限制與判定
			if (dorder.getPickupDate() != null && dorder.getPickupDate().isBefore(LocalDate.now())) {
				throw new IllegalArgumentException("預約日期不可早於今日");
			}
			
			if (dorder.getPickupDate() != null && dorder.getPickupDate().isEqual(LocalDate.now())
					&& dorder.getPickupTime() != null && dorder.getPickupTime().isBefore(LocalTime.now())) {
				throw new IllegalArgumentException("若預約日期為今日，時間不可早於現在");
			}
			if (dorder.getPassengerCount() <= 0) {
				throw new IllegalArgumentException("乘客人數必須大於 0");
			}
			if (dorder.getPassengerCount() > car.getMaxPassengers()) {
				throw new IllegalArgumentException("乘客人數超過該車型可載人數");
			}
			若需要，可檢查行李數量：
			if (dorder.getLuggageCount() > car.getMaxLuggage()) {
				throw new IllegalArgumentException("行李數量超過該車型可放置行李數");
			}
			*/

			// Step 1: 先存一次，以取得自增 dorderId（避免使用 count()+1 的 race condition）*原先的方法
			DriverOrder saved = driverOrderRepository.save(dorder);
			Long generatedId = saved.getDorderId();
			if (generatedId == null) {
				// 不太會發生，但保險起見
				throw new IllegalStateException("取得訂單 ID 失敗，無法生成 orderNo");
			}

			// Step 2: 以 dorderId 產生 orderNo（格式 ads001）
			String orderNo = String.format("ads%03d", generatedId);
			saved.setOrderNo(orderNo);

			// Step 3: 再次儲存更新 orderNo（同一事務內）
			saved = driverOrderRepository.save(saved);

			log.info("訂單建立成功: orderNo={}, dorderId={}, phone={}", saved.getOrderNo(), saved.getDorderId(),
					saved.getPhone());

			return saved;
		} catch (IllegalArgumentException ex) {
			log.warn("建立訂單驗證失敗: {}", ex.getMessage());
			throw ex; // 讓 Controller 或上層處理錯誤回應
		} catch (Exception ex) {
			log.error("建立訂單發生例外", ex);
			// Wrapped into RuntimeException，Transaction will roll back.
			throw new RuntimeException("建立訂單失敗：" + ex.getMessage(), ex);
		}
	}

	/** 查詢所有訂單 */
	@Override
	@Transactional(readOnly = true)
	public List<DriverOrder> findAll() {
		return driverOrderRepository.findAll();
	}

	/** 依電話查詢 */
	@Override
	@Transactional(readOnly = true)
	public List<DriverOrder> findDorderByPhone(String phone) {
		return driverOrderRepository.findByPhone(phone);
	}

	/** 依 ID 查詢 */
	@Override
	@Transactional(readOnly = true)
	public DriverOrder findById(Long id) {
		return driverOrderRepository.findById(id).orElse(null);
	}

	/** 依 orderNo 查詢（例如 ads001） */
	@Override
	@Transactional(readOnly = true)
	public DriverOrder findByOrderNo(String orderNo) {
		return driverOrderRepository.findByOrderNo(orderNo).orElse(null);
	}
}
