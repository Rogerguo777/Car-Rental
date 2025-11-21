package com.demo.model;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ADSCar {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long adscarId;

	private String name;
	private int maxPassengers;
	private int maxLuggage;
	private int baseFare;
	private int perKmFare;

	@Lob
	@Column(name = "Image", length = Integer.MAX_VALUE, nullable = true)
	private byte[] image;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "Create_Date", nullable = false)
	private Date createDate;

	@JsonIgnoreProperties({ "adscar" }) // 忽略掉反向的欄位，不遞迴
	// @JsonManagedReference // 為防止遞迴循環讀取資料，已用上面@取代
	@OneToMany(mappedBy = "adscar", cascade = CascadeType.ALL)
	private List<DriverOrder> dorders;
}
