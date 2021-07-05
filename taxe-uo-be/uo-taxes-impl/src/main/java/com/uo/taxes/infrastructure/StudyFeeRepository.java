package com.uo.taxes.infrastructure;

import com.uo.taxes.domain.StudyFeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyFeeRepository extends JpaRepository<StudyFeeEntity, Long> {
}
