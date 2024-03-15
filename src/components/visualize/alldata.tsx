import * as d3 from "d3";
import { useState } from "react";

    //quality chart fake data
    const endDate = new Date();  
    const startDate = new Date(endDate); 
    startDate.setMonth(endDate.getMonth()-12)
    const dateArray = d3.timeMonths(startDate, endDate);
  
    const qualityChartdata = dateArray.map((date, i) => ({
      date: date,
      value: Math.random() * 100, 
    }));



    //quality stat fake data
    const qualityStatdata = {
        numberOfRecord: 987654,
        numberOfMasterRecord: 579,
        completePercent: 37,
        uniquenessPercent: 78,}



    //quality table fake data
    const qualityTableData = [
        {filename:"country.csv", dataquality:80, completeness:90, uniqueness:90},
        {filename:"Document1.csv", dataquality:85, completeness:95, uniqueness:85},
        {filename:"Document2.csv", dataquality:95, completeness:99, uniqueness:95},
        {filename:"Document3.csv", dataquality:80, completeness:85, uniqueness:90},
    ];

    //export data
    export const getQualityChartData = () => {
        return qualityChartdata;
  };

    export const getQualityStatData = () => {
        return qualityStatdata;
  }

     export const getQualityTableData = () => {
        return qualityTableData;
  }

  