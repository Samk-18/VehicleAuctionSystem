package com.project.base.services.impl;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.base.services.ImageStorageService;

//import com.sun.tools.javac.util.StringUtils;
import org.springframework.util.StringUtils;

@Service
public class ImageStorageServiceImpl implements ImageStorageService {

	
	private final Path uploadDir = Paths.get("uploads");
	public ImageStorageServiceImpl() {
		try {
			Files.createDirectories(uploadDir);
		} catch (IOException e) {
			throw new RuntimeException("Could not create upload directory", e);
		}
	}
	
	public String storeImage(MultipartFile file) throws IOException {
		// TODO Auto-generated method stub
		if(file==null || file.isEmpty()) {
			throw new IOException("No filr Found");
		}
		String fileName=System.currentTimeMillis()+ "_"+ StringUtils.cleanPath(file.getOriginalFilename());
		Path target=uploadDir.resolve(fileName);
		
		Files.copy(file.getInputStream(),target,StandardCopyOption.REPLACE_EXISTING);
		
		return "/uploads/"+fileName;
	}
	
	public List<String> storeImages(MultipartFile[] files) throws IOException {
        List<String> urls = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    urls.add(storeImage(file));
                }
            }
        }
        return urls;
    }

}
