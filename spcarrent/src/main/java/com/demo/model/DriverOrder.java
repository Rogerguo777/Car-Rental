package com.demo.model;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverOrder {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long dorderId;

	private String orderNo; // 新增的訂單編號欄位（ads001）

	private String name;
	private String phone;
	private String email;
	private String pickupPlace;
	private String dropoffPlace;
	private LocalDate pickupDate;
	private LocalTime pickupTime;
	private double distanceKm;
	private int passengerCount;
	private int luggageCount;
	private boolean signage;

	private int totalPrice;

	@JsonIgnoreProperties({ "dorders" }) // ← 忽略反向關聯，不會遞迴
	// @JsonBackReference // 配合@JsonManagedReference，已用上面@取代
	@ManyToOne
	@JoinColumn(name = "adscar_id", nullable = false)
	private ADSCar adscar;
}
