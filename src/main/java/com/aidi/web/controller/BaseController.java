package com.aidi.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BaseController {

    @GetMapping("/welcome")
    public String index() {
        return "Hello World!";
    }
}
