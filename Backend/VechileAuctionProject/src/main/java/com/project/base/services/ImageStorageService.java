package com.project.base.services;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
	
	public String storeImage(MultipartFile file)throws IOException;
	public List<String> storeImages(MultipartFile[] files) throws IOException;

}
