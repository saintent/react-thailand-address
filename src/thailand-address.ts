// @ts-ignore
import JQL from 'jqljs';

const preprocess = (data : Array<any>) => {
    if (!data[0].length) {
        // non-compacted database
        return data;
    }
// compacted database in hierarchical form of:
    let expanded: any[];
    expanded = [];
    data.forEach((provinceEntry : any) => {
        const province = provinceEntry[0];
        const amphurList = provinceEntry[1];
        amphurList.forEach((amphurEntry : any) => {
            const amphur = amphurEntry[0];
            const districtList = amphurEntry[1];
            districtList.forEach((districtEntry : any) => {
                const district = districtEntry[0];
                const zipCodeList = districtEntry[1];
                zipCodeList.forEach((postcode : any) => {
                    expanded.push({
                        subDistrict: district,
                        district: amphur,
                        province: province,
                        postCode: postcode,
                    });
                });
            });
        });
    });
    return expanded;
};

const collection = new JQL(preprocess(require('./address-db')));

export const resolveResultByField = (type : string, searchStr : string) => {
    let possibles = [];
    try {
        possibles = collection.select('*').where(type)
            .match(`^${searchStr}`)
            .orderBy(type)
            .limit(10)
            .fetch();
    } catch (e) {
        return [];
    }
    return Object.values(possibles);
};
