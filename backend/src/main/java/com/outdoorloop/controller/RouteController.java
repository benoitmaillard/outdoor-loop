package com.outdoorloop.controller;

import com.outdoorloop.model.Route;
import com.outdoorloop.repository.RouteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
    private final RouteRepository routeRepository;

    public RouteController(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    @PostMapping
    public Route saveRoute(@RequestBody Route route) {
        return routeRepository.save(route);
    }

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}
