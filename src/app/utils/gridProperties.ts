
import columnsJson from './columns.json';
import { evaluate, parseCell } from './dataTransformer';

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

function _navigate(route: string, props: any, action: any, data: any) {
    const navigateConfig = action?.navigate;
    const appSetters = navigateConfig.appSetters
    const queryParams = evaluate(navigateConfig?.queryParams, data);

    if (!route) return;

    const baseRoute = '/' + evaluate(route, data);
    const subRoute = navigateConfig?.subRoute ? evaluate(navigateConfig.subRoute, data) : null;
    const fullRoute = subRoute ? [baseRoute, subRoute] : [baseRoute];

    if (appSetters) {
        setApplictionState(appSetters, data, props)
    }

    props.router.navigate(fullRoute, { state: data, queryParams });
}

function setApplictionState(appSetters: any, data: any, props: any) {
    const aps = evaluate(appSetters, data)
    for (const key in aps) {
        if (Object.prototype.hasOwnProperty.call(aps, key)) {
            props[key](aps[key])
        }
    }
}

function columnEventHandler(clickHandler: any, params: any, props: any) {
    const { api, targetIds, tarketKey } = clickHandler;
    const targetId = params.event?.target?.[tarketKey];

    if (!targetIds?.includes(targetId) || !api[targetId]) return;

    const data = { ...params.data, targetId };

    const { url, payload, onSuccess, onFailure, headers, method, appSetters } = api[targetId]

    if (method === 'POST') {
        props.postData(url, evaluate(payload, data), headers, evaluate(onSuccess, data), evaluate(onFailure, data));
    } else if (method === 'GET') {
        props.getData(url);
    }
}

function parseColumns(gridProps: any, data: any, props: any) {
    const { columns, navigateKey, row, route } = gridProps
    const columnsDefs = columns.map((col: any) => {
        const { field, headerName, flex ,headerComponent, headerComponentTemplate, onClick, cellRenderer } = col;

        return {
            field,
            headerName,
            flex,
            headerComponentParams: headerComponent ? {
                template: headerComponentTemplate
            } : null,
            cellRenderer: (params: any) => parseCell(cellRenderer, params.data),
            onCellClicked: (params: any) => {
                // const htmlElement = params.event.target.classList.contains(col.class)
                const htmlElement = null

                if (onClick?.clickHandler) { // Handle column events
                    columnEventHandler(onClick.clickHandler, params, props)
                } else if (params.data[navigateKey] && row && row.onClick) { // Handle row events
                    _navigate(route, props, row.onClick, params.data)
                }

                if (htmlElement) {
                    // TODO: handle cell click 
                    if (onClick && onClick.appSetters) {
                        const aps = evaluate(onClick.appSetters, params.data)
                        for (const key in aps) {
                            if (Object.prototype.hasOwnProperty.call(aps, key)) {
                                props[key](aps[key])
                            }
                        }
                    }
                    _navigate(route, props, onClick, params.data)
                }
            }
        }
    })
    return columnsDefs
}

export function gridColumns(gridId: string, data: any, props: any) {
    const dGrid: any = columnsJson
    return parseColumns(dGrid[gridId], data, props)
}