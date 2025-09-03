package com.example.service;

import com.example.dto.PayrollItemDTO;
import com.example.entity.Employee;
import com.example.entity.PayrollItem;
import com.example.entity.PayrollRun;
import com.example.entity.PayrollRunStatus;
import com.example.repo.EmployeeRepository;
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
class PayrollServiceTest {

    @Mock private PayrollRunRepository runRepo;
    @Mock private EmployeeRepository empRepo;
    @Mock private PayrollItemRepository itemRepo;

    @InjectMocks private PayrollService payrollService;

    @Test
    void createRun_success() {
        when(runRepo.findByYearAndMonth(2025, 1)).thenReturn(Optional.empty());
        when(runRepo.save(any(PayrollRun.class))).thenAnswer(inv -> inv.getArgument(0));

        PayrollRun run = payrollService.createRun(2025, 1);
        assertEquals(PayrollRunStatus.DRAFT, run.getStatus());
    }

    @Test
    void createRun_duplicate_throws() {
        when(runRepo.findByYearAndMonth(2025, 1)).thenReturn(Optional.of(new PayrollRun()));
        RuntimeException ex = assertThrows(RuntimeException.class, () -> payrollService.createRun(2025, 1));
        assertTrue(ex.getMessage().contains("already exists"));
    }

    @Test
    void processRun_createsItemsAndSetsProcessed() {
        PayrollRun run = new PayrollRun(2025,1);
        run.setId(10L);
        run.setStatus(PayrollRunStatus.DRAFT);

        Employee e1 = new Employee(); e1.setId(1L); e1.setBaseSalary(new BigDecimal("1000"));
        when(runRepo.findById(10L)).thenReturn(Optional.of(run));
        when(empRepo.findAll()).thenReturn(List.of(e1));
        when(itemRepo.findByRunAndEmployee(run, e1)).thenReturn(Optional.empty());
        when(itemRepo.save(any(PayrollItem.class))).thenAnswer(inv -> inv.getArgument(0));
        when(runRepo.save(any(PayrollRun.class))).thenAnswer(inv -> inv.getArgument(0));

        PayrollRun out = payrollService.processRun(10L);
        assertEquals(PayrollRunStatus.PROCESSED, out.getStatus());
        // deduction = 5% of 1000 = 50 → net = 950
        // verified indirectly via item creation; for direct check, you can capture argument:
        verify(itemRepo).save(argThat(it ->
            new BigDecimal("950").compareTo(it.getNetSalary()) == 0
        ));
    }

    @Test
    void processRun_locked_throws() {
        PayrollRun run = new PayrollRun(2025,1);
        run.setId(10L);
        run.setStatus(PayrollRunStatus.LOCKED);
        when(runRepo.findById(10L)).thenReturn(Optional.of(run));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> payrollService.processRun(10L));
        assertTrue(ex.getMessage().contains("locked"));
    }

    @Test
    void itemsDto_returnsMappedDTOs() {
        // itemsDto uses itemRepo.findAllByRunIdWithEmployee(runId)
        PayrollItem pi = new PayrollItem();
        Employee e = new Employee(); e.setId(2L); e.setFirstName("A"); e.setLastName("B");
        pi.setEmployee(e);
        pi.setBasicSalary(new BigDecimal("100"));
        pi.setDeductions(new BigDecimal("5"));
        pi.setBonus(BigDecimal.ZERO);
        pi.setNetSalary(new BigDecimal("95"));

        when(itemRepo.findAllByRunIdWithEmployee(10L)).thenReturn(List.of(pi));

        List<PayrollItemDTO> dtos = payrollService.itemsDto(10L);
        assertEquals(1, dtos.size());
        assertEquals(2L, dtos.get(0).getEmployeeId());
        assertEquals("A B", dtos.get(0).getEmployeeName());
        assertEquals(0, new BigDecimal("95").compareTo(dtos.get(0).getNetSalary()));
    }

    @Test
    void mySlipDto_success() {
        PayrollRun run = new PayrollRun(2025, 1);
        Employee me = new Employee(); me.setId(3L); me.setFirstName("C");
        PayrollItem pi = new PayrollItem();
        pi.setNetSalary(new BigDecimal("500"));

        when(runRepo.findByYearAndMonth(2025,1)).thenReturn(Optional.of(run));
        when(itemRepo.findByRunAndEmployee(run, me)).thenReturn(Optional.of(pi));

        var dto = payrollService.mySlipDto(2025, 1, me);
        assertEquals(3L, dto.getEmployeeId());
        assertEquals(0, new BigDecimal("500").compareTo(dto.getNetSalary()));
    }
}
