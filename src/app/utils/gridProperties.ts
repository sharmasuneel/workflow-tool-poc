
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
    if (typeof qp === 'string' && qp.startsWith('~{')) {
        return parseCell(qp, data)
    } else if (typeof qp === 'object' && qp !== null) {
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
        return result;
    }
    return qp
}

function _navigate(route: string, props: any, action: any, data: any) {
    const navigateConfig = action?.navigate;
    const queryParams = evaluate(navigateConfig?.queryParams, data);

    if (!route) return;

    const baseRoute = '/' + evaluate(route, data);
    const subRoute = navigateConfig?.subRoute ? evaluate(navigateConfig.subRoute, data) : null;
    const fullRoute = subRoute ? [baseRoute, subRoute] : [baseRoute];

    props.router.navigate(fullRoute, { state:data,queryParams });
}


function parseColumns(gridProps: any, data: any, props: any) {
    const { columns, navigateKey, row, route } = gridProps
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
                // const htmlElement = params.event.target.classList.contains(col.class)
                const htmlElement = null
                
                console.log('parseColumns > htmlElement', htmlElement)
                if (htmlElement) {
                    // TODO: handle cell click 
                    const action = col.onClick
                    if (action && action.appSetters) {
                        const aps = evaluate(action.appSetters, params.data)
                        for (const key in aps) {
                            if (Object.prototype.hasOwnProperty.call(aps, key)) {
                                props[key](aps[key])
                            }
                        }
                    }
                    _navigate(route, props, action, params.data)
                }
                else if (params.data[navigateKey] && row && row.onClick) {
                    _navigate(route, props, row.onClick, params.data)
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