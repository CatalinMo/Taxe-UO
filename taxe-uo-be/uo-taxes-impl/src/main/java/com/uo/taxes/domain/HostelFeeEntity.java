package com.uo.taxes.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "hostel_fee")
public class HostelFeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HOSTEL_FEE_ID", unique = true)
    private Long id;

    @Column(name = "HOSTEL_NAME")
    private String hostelName;

    @Column(name = "NAME")
    private String name;

    @Column(name = "VALUE")
    private Float value;

    @Column(name = "BUDGET")
    private boolean budget;

    @Column(name = "TYPE")
    private String type;
}
