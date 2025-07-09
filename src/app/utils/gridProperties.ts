
import columnsJson from './columns.json';

export function parseCell(str: any, params: any) {
    const retStr = str.replace(/~\{(.*?)\}/g, (_: any, fnBody: any) => {
        try {
            // Create a new function with params in scope
            // eslint-disable-next-line no-new-func
            const fn = new Function('params', `return ${fnBody};`);
            return fn(params);
        } catch (e) {
            return '';
        }
    });
    console.log('parseCell > ', retStr)
    return retStr
}
export function getSignalClass(date: string): string {
    const currentDate = new Date();
    const taskEndDate = new Date(date); // 
    const diffInMs = Math.abs(currentDate.getTime() - taskEndDate.getTime());
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays <= 5) {
        return 'red-signal';
    } else if (diffInDays <= 10) {
        return 'yellow-signal';
    } else {
        return 'green-signal';
    }

}

function evaluate(qp: any, data: any) {
    const result: any = {};
    for (const key in qp) {
        if (Object.prototype.hasOwnProperty.call(qp, key)) {
            let value = qp[key]
            if (typeof qp[key] === 'string' && qp[key].startsWith('~{')) {
                value = parseCell(qp[key], data)
            }
            result[key] = value;
        }
    }
    console.log('parseQueryParams > ', result);
    return result;
}

function parseColumns(columns: any, data: any, props: any) {
    const columnsDefs = columns.map((col: any) => {
        const { field, headerName, width, headerComponent, headerComponentTemplate } = col;

        return {
            field,
            headerName,
            width,
            headerComponentParams: headerComponent ? {
                template: headerComponentTemplate
            } : null,
            cellRenderer: (params: any) => {
                return parseCell(col.cellRenderer, params.data)
            },

            onCellClicked: (params: any) => {
                const htmlElement = params.event.target.classList.contains(col.class)
                console.log('parseColumns > htmlElement', htmlElement)
                if (htmlElement) {
                    const action = col.onClick.action
                    if (action && action.appSetters) {
                        const aps = evaluate(action.appSetters, params.data)
                        for (const key in aps) {
                            if (Object.prototype.hasOwnProperty.call(aps, key)) {
                                props[key](aps[key])
                            }
                        }
                    }
                    if (action && action.navigate) {
                        //TODO perforn action
                        if (action.navigate.route) {
                            props.router.navigate([action.navigate.route], {
                                queryParams: evaluate(action.navigate.queryParams, params.data)
                            });
                        }

                    }
                }
            }

        }
    })
    console.log('parseColumns > ', columnsDefs)
    return columnsDefs
}

export function gridColumns(gridId: string, data: any, props: any) {
    const dGrid: any = columnsJson
    const columns = parseColumns(dGrid[gridId], data, props)
    return columns

}