package com.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.demo.model.ADSCar;
import com.demo.service.ADSCarService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/adscar")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ADSCarController {

	private final ADSCarService adscarService;

	@GetMapping
	public ResponseEntity<?> getAllCars() {
		return ResponseEntity.ok(adscarService.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getCarById(@PathVariable Long id) {
		ADSCar car = adscarService.findById(id);
		if (car == null)
			return ResponseEntity.notFound().build();
		return ResponseEntity.ok(car);
	}

	@GetMapping("/{id}/image")
	public ResponseEntity<byte[]> getCarImage(@PathVariable Long id) {
		ADSCar car = adscarService.findById(id);
		if (car == null || car.getImage() == null)
			return ResponseEntity.notFound().build();

		return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(car.getImage());
	}

	@PostMapping(value = "/{id}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> uploadCarImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {

		try {
			ADSCar car = adscarService.findById(id);
			if (car == null)
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("車輛不存在");

			car.setImage(file.getBytes());
			adscarService.save(car);

			return ResponseEntity.ok("圖片上傳成功");

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("圖片上傳失敗：" + e.getMessage());
		}
	}
}
