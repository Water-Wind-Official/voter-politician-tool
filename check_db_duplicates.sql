-- Check for duplicate house members in database

-- Check for duplicate names
SELECT name, COUNT(*) as count
FROM representatives
WHERE chamber = 'house'
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check for duplicate external_ids (should be unique)
SELECT external_id, COUNT(*) as count
FROM representatives
WHERE chamber = 'house'
GROUP BY external_id
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check for duplicate phone numbers
SELECT office_phone, COUNT(*) as count
FROM representatives
WHERE chamber = 'house' AND office_phone IS NOT NULL AND office_phone != ''
GROUP BY office_phone
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check for duplicate office addresses
SELECT office_address, COUNT(*) as count
FROM representatives
WHERE chamber = 'house' AND office_address IS NOT NULL AND office_address != ''
GROUP BY office_address
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Check for members with same name and state (shouldn't happen)
SELECT name, state_code, COUNT(*) as count
FROM representatives
WHERE chamber = 'house'
GROUP BY name, state_code
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Total house members count
SELECT COUNT(*) as total_house_members FROM representatives WHERE chamber = 'house';