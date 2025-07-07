import { gridColumns, parseCell } from './gridProperties';
import columnsJSON from './columns.json'


const str = "<div><a class=\"my-action-btn\">~{params.getValue()}</a> </div>"

/* describe('parseCell', () => {
    it('should return the original string if there are no function patterns', () => {
        const result = parseCell('Hello World', {});
        expect(result).toBe('Hello World');
    });
    it('should evaluate and replace function patterns with the result', () => {
        const params = { 
            getValue: () => 'TestValue',
            data: {
                workflowId: 'abc'
            }

         };
        const input = '<div><a class="my-action-btn">~{params.getValue()}</a>~{params.data.workflowId}</div>';
        const result = parseCell(input, params);
        expect(result).toBe('<div><a class="my-action-btn">TestValue</a>abc</div>');
    });

    it('should handle multiple function patterns in the string', () => {
        const params = { getValue: () => 'A', getOther: () => 'B' };
        const input = 'X ~{params.getValue()} Y ~{params.getOther()} Z';
        const result = parseCell(input, params);
        expect(result).toBe('X A Y B Z');
    });

    it('should return empty string for invalid function pattern', () => {
        const params = {};
        const input = 'Value: ~{params.nonExistent()}';
        const result = parseCell(input, params);
        expect(result).toBe('Value: ');
    });

    it('should not replace if pattern is malformed', () => {
        const params = { getValue: () => 'A' };
        const input = 'No pattern here: ~params.getValue()}';
        const result = parseCell(input, params);
        expect(result).toBe('No pattern here: ~params.getValue()}');
    });

});
 */

describe('parseColumns', () => {
    const params = {
        fieldValue: 'Workflow 1',
        data: {
            workflowId: 'wid1',
            selectedRole: {
                role: 'owner'
            }
        }
    }

    it('should return columns', () => {
         const gC =  gridColumns('tasks', params);
    });

});