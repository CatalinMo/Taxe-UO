package com.uo.taxes.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "other_fees")
public class OtherFeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OTHER_FEES_ID", unique = true)
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "VALUE")
    private Float value;

    @Column(name = "TYPE")
    private String type;
}
