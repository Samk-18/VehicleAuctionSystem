package com.project.base.dto;

import java.util.List;

public class ListResponse<T> {

    private String message;
    private List<T> data;

    public ListResponse(String message, List<T> data) {
        this.message = message;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }
}
