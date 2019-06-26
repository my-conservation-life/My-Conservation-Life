const QUERY_FIND = `SELECT
sponsor.name AS sponsor_name,
project.name AS project_name,
asset_type_id,
asset.id AS asset_id,
asset_type.name AS asset_type,
asset_type.description AS asset_description,
ST_X(asset.location) AS latitude,
ST_Y(asset.location) AS longitude
FROM
asset
JOIN project ON asset.project_id = project.id
JOIN sponsor ON project.sponsor_id = sponsor.id
JOIN asset_type ON asset.asset_type_id = asset_type.id
WHERE TRUE `;

/**
 * Find project assets.
 *
 * Returns all assets across all projects unless projectId is given.
 *
 * @param {number} [projectId] - (assumes isValidDbInteger(projectId)): optional: filter assets by this Project ID
 * @returns {object[]|undefined} array of assets with fields (id, project_id, latitude, and longitude), or undefined if projectId is invalid.
 * @throws error if the DB query failed to execute
 */
const find = async (sponsorId, projectId, assetType) => {
    let query = QUERY_FIND;
    let values = [];
    if ((typeof sponsorId !== 'undefined') & (sponsorId > 0)) {
        query = query + `AND sponsor_id = ${values.length + 1}` + ' ';
        values.push(sponsorId);
    }
    if ((typeof projectId !== 'undefined') & (projectId > 0)) {
        query = query + `AND project_id = ${values.length + 1}` + ' ';
        values.push(projectId);
    }
    if ((typeof assetType !== 'undefined') & (assetType > 0)) {
        query = query + `AND asset_type_id = ${values.length + 1}` + ' ';
        values.push(assetType);
    }
    const result = await global.dbPool.query(query, values);
    return result.rows;
};

module.exports = {
    find
};
