package com.example.service;

import com.example.dto.DepartmentCostRow;
import com.example.dto.PayrollSummaryResponse;
import com.example.entity.Employee;
import com.example.entity.PayrollItem;
import com.example.entity.PayrollRun;
import com.example.repo.PayrollItemRepository;
import com.example.repo.PayrollRunRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock private PayrollRunRepository runRepo;
    @Mock private PayrollItemRepository itemRepo;

    @InjectMocks private ReportService reportService;

    @Test
    void payrollSummary_aggregatesTotals() {
        PayrollRun run = new PayrollRun(2025, 1);
        Employee e = new Employee(); e.setDepartment("ENG");
        PayrollItem it = new PayrollItem();
        it.setEmployee(e);
        it.setBasicSalary(new BigDecimal("100"));
        it.setDeductions(new BigDecimal("10"));
        it.setBonus(new BigDecimal("5"));
        it.setNetSalary(new BigDecimal("95"));

        when(runRepo.findByYearAndMonth(2025,1)).thenReturn(Optional.of(run));
        when(itemRepo.findByRun(run)).thenReturn(List.of(it));

        PayrollSummaryResponse res = reportService.payrollSummary(2025,1);
        assertEquals(1, res.getEmployeeCount());
        assertEquals(0, new BigDecimal("100").compareTo(res.getTotalBasic()));
        assertEquals(0, new BigDecimal("10").compareTo(res.getTotalDeductions()));
        assertEquals(0, new BigDecimal("5").compareTo(res.getTotalBonus()));
        assertEquals(0, new BigDecimal("95").compareTo(res.getTotalNet()));
    }

    @Test
    void departmentCost_groupsByDepartment() {
        PayrollRun run = new PayrollRun(2025, 1);

        Employee e1 = new Employee(); e1.setDepartment("ENG");
        PayrollItem i1 = new PayrollItem(); i1.setEmployee(e1);
        i1.setBasicSalary(new BigDecimal("100"));
        i1.setDeductions(new BigDecimal("10"));
        i1.setBonus(new BigDecimal("0"));
        i1.setNetSalary(new BigDecimal("90"));

        Employee e2 = new Employee(); e2.setDepartment("HR");
        PayrollItem i2 = new PayrollItem(); i2.setEmployee(e2);
        i2.setBasicSalary(new BigDecimal("200"));
        i2.setDeductions(new BigDecimal("20"));
        i2.setBonus(new BigDecimal("5"));
        i2.setNetSalary(new BigDecimal("185"));

        when(runRepo.findByYearAndMonth(2025,1)).thenReturn(Optional.of(run));
        when(itemRepo.findByRun(run)).thenReturn(List.of(i1, i2));

        List<DepartmentCostRow> rows = reportService.departmentCost(2025,1);
        assertEquals(2, rows.size());
        assertTrue(rows.stream().anyMatch(r -> r.getDepartment().equals("ENG")));
        assertTrue(rows.stream().anyMatch(r -> r.getDepartment().equals("HR")));
    }
}
