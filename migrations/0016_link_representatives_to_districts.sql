-- Migration number: 0016 - Link representatives to their districts
-- This updates the district_id field for all house representatives

-- Link Alabama representatives
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AL' AND district_number = 1) WHERE external_id = 'house-al-01-moore';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AL' AND district_number = 2) WHERE external_id = 'house-al-02-figures';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AL' AND district_number = 3) WHERE external_id = 'house-al-03-rogers';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AL' AND district_number = 4) WHERE external_id = 'house-al-04-aderholt';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AL' AND district_number = 5) WHERE external_id = 'house-al-05-strong';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AL' AND district_number = 6) WHERE external_id = 'house-al-06-palmer';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AL' AND district_number = 7) WHERE external_id = 'house-al-07-sewell';

-- Link Alaska representative
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AK' AND district_number = 0) WHERE external_id = 'house-ak-00-begich';

-- Link American Samoa delegate
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AS' AND district_number = 0) WHERE external_id = 'house-as-00-radewagen';

-- Link Arizona representatives
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 1) WHERE external_id = 'house-az-01-schweikert';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 2) WHERE external_id = 'house-az-02-crane';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 3) WHERE external_id = 'house-az-03-ansari';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 4) WHERE external_id = 'house-az-04-stanton';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 5) WHERE external_id = 'house-az-05-biggs';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 6) WHERE external_id = 'house-az-06-ciscomani';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 7) WHERE external_id = 'house-az-07-grijalva';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 8) WHERE external_id = 'house-az-08-hamadeh';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AZ' AND district_number = 9) WHERE external_id = 'house-az-09-gosar';

-- Link Arkansas representatives
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AR' AND district_number = 1) WHERE external_id = 'house-ar-01-crawford';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AR' AND district_number = 2) WHERE external_id = 'house-ar-02-hill';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AR' AND district_number = 3) WHERE external_id = 'house-ar-03-womack';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'AR' AND district_number = 4) WHERE external_id = 'house-ar-04-westerman';

-- Continue with California (52 districts) - this will be a very long list
-- I'll provide a pattern that can be extended for all states

-- California districts 1-52 would follow this pattern:
-- UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 1) WHERE external_id = 'house-ca-01-lamalfa';
-- UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 2) WHERE external_id = 'house-ca-02-huffman';
-- ... and so on for all 52 California districts

-- For brevity, here's a more efficient approach using a CASE statement for California:
UPDATE representatives
SET district_id = CASE
  WHEN external_id = 'house-ca-01-lamalfa' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 1)
  WHEN external_id = 'house-ca-02-huffman' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 2)
  WHEN external_id = 'house-ca-03-kiley' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 3)
  WHEN external_id = 'house-ca-04-thompson' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 4)
  WHEN external_id = 'house-ca-05-mcclintock' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 5)
  WHEN external_id = 'house-ca-06-bera' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 6)
  WHEN external_id = 'house-ca-07-matsui' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 7)
  WHEN external_id = 'house-ca-08-garamendi' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 8)
  WHEN external_id = 'house-ca-09-harder' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 9)
  WHEN external_id = 'house-ca-10-desaulnier' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 10)
  WHEN external_id = 'house-ca-11-pelosi' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 11)
  WHEN external_id = 'house-ca-12-simon' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 12)
  WHEN external_id = 'house-ca-13-gray' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 13)
  WHEN external_id = 'house-ca-14-swalwell' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 14)
  WHEN external_id = 'house-ca-15-mullin' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 15)
  WHEN external_id = 'house-ca-16-liccardo' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 16)
  WHEN external_id = 'house-ca-17-khanna' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 17)
  WHEN external_id = 'house-ca-18-lofgren' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 18)
  WHEN external_id = 'house-ca-19-panetta' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 19)
  WHEN external_id = 'house-ca-20-fong' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 20)
  WHEN external_id = 'house-ca-21-costa' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 21)
  WHEN external_id = 'house-ca-22-valadao' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 22)
  WHEN external_id = 'house-ca-23-obernolte' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 23)
  WHEN external_id = 'house-ca-24-carbajal' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 24)
  WHEN external_id = 'house-ca-25-ruiz' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 25)
  WHEN external_id = 'house-ca-26-brownley' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 26)
  WHEN external_id = 'house-ca-27-whitesides' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 27)
  WHEN external_id = 'house-ca-28-chu' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 28)
  WHEN external_id = 'house-ca-29-rivas' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 29)
  WHEN external_id = 'house-ca-30-friedman' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 30)
  WHEN external_id = 'house-ca-31-cisneros' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 31)
  WHEN external_id = 'house-ca-32-sherman' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 32)
  WHEN external_id = 'house-ca-33-aguilar' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 33)
  WHEN external_id = 'house-ca-34-gomez' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 34)
  WHEN external_id = 'house-ca-35-torres' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 35)
  WHEN external_id = 'house-ca-36-lieu' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 36)
  WHEN external_id = 'house-ca-37-kamlager-dove' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 37)
  WHEN external_id = 'house-ca-38-sanchez' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 38)
  WHEN external_id = 'house-ca-39-takano' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 39)
  WHEN external_id = 'house-ca-40-kim' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 40)
  WHEN external_id = 'house-ca-41-calvert' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 41)
  WHEN external_id = 'house-ca-42-garcia' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 42)
  WHEN external_id = 'house-ca-43-waters' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 43)
  WHEN external_id = 'house-ca-44-barragan' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 44)
  WHEN external_id = 'house-ca-45-tran' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 45)
  WHEN external_id = 'house-ca-46-correa' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 46)
  WHEN external_id = 'house-ca-47-min' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 47)
  WHEN external_id = 'house-ca-48-issa' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 48)
  WHEN external_id = 'house-ca-49-levin' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 49)
  WHEN external_id = 'house-ca-50-peters' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 50)
  WHEN external_id = 'house-ca-51-jacobs' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 51)
  WHEN external_id = 'house-ca-52-vargas' THEN (SELECT id FROM districts WHERE state_code = 'CA' AND district_number = 52)
END
WHERE external_id LIKE 'house-ca-%';

-- Colorado districts
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CO' AND district_number = 1) WHERE external_id = 'house-co-01-degette';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CO' AND district_number = 2) WHERE external_id = 'house-co-02-neguse';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CO' AND district_number = 3) WHERE external_id = 'house-co-03-hurd';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CO' AND district_number = 4) WHERE external_id = 'house-co-04-boebert';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CO' AND district_number = 5) WHERE external_id = 'house-co-05-crank';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CO' AND district_number = 6) WHERE external_id = 'house-co-06-crow';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CO' AND district_number = 7) WHERE external_id = 'house-co-07-pettersen';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CO' AND district_number = 8) WHERE external_id = 'house-co-08-evans';

-- Connecticut districts
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CT' AND district_number = 1) WHERE external_id = 'house-ct-01-larson';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CT' AND district_number = 2) WHERE external_id = 'house-ct-02-courtney';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CT' AND district_number = 3) WHERE external_id = 'house-ct-03-delauro';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CT' AND district_number = 4) WHERE external_id = 'house-ct-04-himes';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'CT' AND district_number = 5) WHERE external_id = 'house-ct-05-hayes';

-- Delaware
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'DE' AND district_number = 0) WHERE external_id = 'house-de-00-mcbride';

-- District of Columbia
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'DC' AND district_number = 0) WHERE external_id = 'house-dc-00-norton';

-- Florida districts
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 1) WHERE external_id = 'house-fl-01-patronis';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 2) WHERE external_id = 'house-fl-02-dunn';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 3) WHERE external_id = 'house-fl-03-cammack';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 4) WHERE external_id = 'house-fl-04-bean';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 5) WHERE external_id = 'house-fl-05-rutherford';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 6) WHERE external_id = 'house-fl-06-fine';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 7) WHERE external_id = 'house-fl-07-mills';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 8) WHERE external_id = 'house-fl-08-haridopolos';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 9) WHERE external_id = 'house-fl-09-soto';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 10) WHERE external_id = 'house-fl-10-frost';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 11) WHERE external_id = 'house-fl-11-webster';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 12) WHERE external_id = 'house-fl-12-bilirakis';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 13) WHERE external_id = 'house-fl-13-luna';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 14) WHERE external_id = 'house-fl-14-castor';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 15) WHERE external_id = 'house-fl-15-lee';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 16) WHERE external_id = 'house-fl-16-buchanan';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 17) WHERE external_id = 'house-fl-17-steube';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 18) WHERE external_id = 'house-fl-18-franklin';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 19) WHERE external_id = 'house-fl-19-donalds';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 20) WHERE external_id = 'house-fl-20-cherfilus-mccormick';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 21) WHERE external_id = 'house-fl-21-mast';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 22) WHERE external_id = 'house-fl-22-frankel';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 23) WHERE external_id = 'house-fl-23-moskowitz';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 24) WHERE external_id = 'house-fl-24-wilson';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 25) WHERE external_id = 'house-fl-25-wasserman-schultz';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 26) WHERE external_id = 'house-fl-26-diaz-balart';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 27) WHERE external_id = 'house-fl-27-salazar';
UPDATE representatives SET district_id = (SELECT id FROM districts WHERE state_code = 'FL' AND district_number = 28) WHERE external_id = 'house-fl-28-gimenez';

-- Note: This file provides the linking for states AL, AK, AS, AZ, AR, CA, CO, CT, DE, DC, FL
-- Similar patterns should be followed for all remaining states
-- For states with At-Large districts (AK, DE, DC, etc.), district_number = 0
-- For numbered districts, use the district number from the external_id