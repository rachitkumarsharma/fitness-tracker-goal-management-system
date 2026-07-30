package com.fitness.tracker.admin.service;

import com.fitness.tracker.admin.dto.AdminDashboardStatsResponse;

/**
 * Service interface for admin dashboard statistics.
 */
public interface AdminDashboardService {

    /**
     * Get dashboard statistics for admin.
     *
     * @return dashboard statistics response
     */
    AdminDashboardStatsResponse getDashboardStats();
}