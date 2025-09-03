package com.example.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.entity.Employee;
import com.example.entity.PayrollItem;
import com.example.entity.PayrollRun;

public interface PayrollItemRepository extends JpaRepository<PayrollItem, Long> {
	 List<PayrollItem> findByRun(PayrollRun run);

	    Optional<PayrollItem> findByRunAndEmployee(PayrollRun run, Employee employee);

	    void deleteByRun(PayrollRun run);

	   

	    // Simple by runId (no eager fetch)
	    @Query("select pi from PayrollItem pi where pi.run.id = :runId")
	    List<PayrollItem> findAllByRunId(@Param("runId") Long runId);
	    
	    void deleteByEmployee(Employee employee);

	    // Eagerly fetch employee to avoid lazy proxy issues during JSON serialization
	    @Query("select pi from PayrollItem pi join fetch pi.employee e where pi.run.id = :runId")
	    List<PayrollItem> findAllByRunIdWithEmployee(@Param("runId") Long runId);

	    // Prevent duplicates when processing a run
	    boolean existsByRunAndEmployee(PayrollRun run, Employee employee);

	    // Convenience delete by runId
	    @Modifying
	    @Transactional
	    @Query("delete from PayrollItem pi where pi.run.id = :runId")
	    void deleteByRunId(@Param("runId") Long runId);


}
