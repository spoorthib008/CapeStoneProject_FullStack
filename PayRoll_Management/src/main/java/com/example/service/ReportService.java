package com.example.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.DepartmentCostRow;
import com.example.dto.PayrollSummaryResponse;
import com.example.entity.PayrollItem;
import com.example.entity.PayrollRun;
import com.example.exception.ResourceNotFoundException;
import com.example.repo.PayrollItemRepository;
import com.example.repo.PayrollRunRepository;

import jakarta.transaction.Transactional;

@Service
public class ReportService {

    private final PayrollRunRepository runRepo;
    private final PayrollItemRepository itemRepo;

    @Autowired
    public ReportService(PayrollRunRepository runRepo, PayrollItemRepository itemRepo) {
        this.runRepo = runRepo;
        this.itemRepo = itemRepo;
    }

    @Transactional
    public PayrollSummaryResponse payrollSummary(int year, int month) {
        PayrollRun run = runRepo.findByYearAndMonth(year, month)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll run not found for " + year + "-" + month));
        List<PayrollItem> items = itemRepo.findByRun(run);

        BigDecimal totalBasic = BigDecimal.ZERO;
        BigDecimal totalDeductions = BigDecimal.ZERO;
        BigDecimal totalBonus = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;

        for (PayrollItem it : items) {
            totalBasic = totalBasic.add(it.getBasicSalary());
            totalDeductions = totalDeductions.add(it.getDeductions());
            totalBonus = totalBonus.add(it.getBonus());
            totalNet = totalNet.add(it.getNetSalary());
        }

        PayrollSummaryResponse res = new PayrollSummaryResponse();
        res.setYear(year);
        res.setMonth(month);
        res.setEmployeeCount(items.size());
        res.setTotalBasic(totalBasic);
        res.setTotalDeductions(totalDeductions);
        res.setTotalBonus(totalBonus);
        res.setTotalNet(totalNet);
        return res;
    }

    @Transactional
    public List<DepartmentCostRow> departmentCost(int year, int month) {
        PayrollRun run = runRepo.findByYearAndMonth(year, month)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll run not found for " + year + "-" + month));
        List<PayrollItem> items = itemRepo.findByRun(run);

        Map<String, DepartmentCostRow> map = new LinkedHashMap<>();
        for (PayrollItem it : items) {
            String dept = it.getEmployee() != null ? it.getEmployee().getDepartment() : "UNKNOWN";
            if (dept == null || dept.trim().isEmpty()) dept = "UNKNOWN";
            DepartmentCostRow row = map.computeIfAbsent(dept, d -> {
                DepartmentCostRow r = new DepartmentCostRow();
                r.setDepartment(d);
                r.setTotalBasic(BigDecimal.ZERO);
                r.setTotalDeductions(BigDecimal.ZERO);
                r.setTotalBonus(BigDecimal.ZERO);
                r.setTotalNet(BigDecimal.ZERO);
                return r;
            });
            row.setTotalBasic(row.getTotalBasic().add(it.getBasicSalary()));
            row.setTotalDeductions(row.getTotalDeductions().add(it.getDeductions()));
            row.setTotalBonus(row.getTotalBonus().add(it.getBonus()));
            row.setTotalNet(row.getTotalNet().add(it.getNetSalary()));
        }

        return new ArrayList<>(map.values());
    }
}
