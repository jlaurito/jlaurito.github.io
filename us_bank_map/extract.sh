#! bin/bash
#
#
# extract needed columns from deposit data
csvcut -e latin-1 -c STCNTYBR,DEPSUMBR,RSSDID data/ALL_2013.csv > data/branch_deposits.csv
#
#
# extract needed columns from institution data
csvcut -e latin-1 -c NAME,DEPDOM,FED_RSSD,FEDCHRTR data/INSTITUTIONS2.CSV > data/all_banks.csv
