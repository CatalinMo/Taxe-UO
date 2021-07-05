package com.uo.taxes.infrastructure;

import com.uo.taxes.domain.ActiveStudyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActiveStudyRepository extends JpaRepository<ActiveStudyEntity, Long> {
}
