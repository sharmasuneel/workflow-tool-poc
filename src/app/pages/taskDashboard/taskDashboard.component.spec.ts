import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDashboardComponent } from './taskDashboard.component';
import { AppService, DataService, PopupService } from '@services';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

// Mocks
const mockAppService = {
  getUserTasks: jasmine.createSpy().and.returnValue([{task: { taskStatus: 'pending'}}, {task: { taskStatus: 'completed'}}]),
  setUserTasks: jasmine.createSpy(),
  setPhase: jasmine.createSpy(),
  setWorkflowId: jasmine.createSpy()
};


const mockDataService = {
  getData: jasmine.createSpy().and.returnValue(of([{ workflowid: 'w1', task: { taskId: 't1', taskType: 'upload' } }, ])),
  postData: jasmine.createSpy().and.returnValue(of({}))
};

const mockPopupService = {
  open: jasmine.createSpy()
};

const mockRouter = {
  navigate: jasmine.createSpy() 
};

describe('TaskDashboardComponent', () => {
  let component: TaskDashboardComponent;
  let fixture: ComponentFixture<TaskDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDashboardComponent],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: DataService, useValue: mockDataService },
        { provide: PopupService, useValue: mockPopupService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call resetFilterDataByTab on init', () => {
    spyOn(component, 'resetFilterDataByTab');
    component.ngOnInit();
    expect(component.resetFilterDataByTab).toHaveBeenCalledTimes(1);
  });

  it('should update selectedTab and call resetFilterDataByTab', () => {
    spyOn(component, 'resetFilterDataByTab');
    component.setSelectedTab('completed');
    expect(component.selectedTab).toBe('completed');
    expect(component.resetFilterDataByTab).toHaveBeenCalledTimes(1);
  });

  it('should refresh tasks and call setUserTasks', async () => {
    component.refreshTasks();
    const userTasks = [{ workflowid: 'w1', task: { taskId: 't1', taskType: 'upload' } }]
    expect(mockDataService.getData).toHaveBeenCalled();

    mockDataService.getData().subscribe((data: any) => {
      expect(data).toEqual(userTasks)
    })
    expect(mockAppService.setUserTasks).toHaveBeenCalled();
  });

  it('should handle postData success and call popupService', () => {
    const onSuccess = { message: 'Success', title: 'Done', type: 'success' };
    const onFailure = { message: 'Fail', title: 'Error', type: 'error' };
    const headers = { 'content-type': 'appliocation/JSON' };
    const payload = { 'workFlowId': 'w1', taskId: 't1' };
    component.handlePostData('url', payload, headers, onSuccess, onFailure);

    expect(mockPopupService.open).toHaveBeenCalledWith(jasmine.objectContaining({ title: 'Done' }));
  });

  it('should handle postData failure and call popupService with error', () => {
    // Arrange
    const onSuccess = { message: 'Success', title: 'Done', type: 'success' };
    const onFailure = { message: 'Failed to post', title: 'Error', type: 'error' };

    // Simulate error response
    mockDataService.postData.and.returnValue(throwError(() => new Error('Failed to post')));

    // Act
    component.handlePostData('url', {}, {}, onSuccess, onFailure);

    // Assert
    expect(mockPopupService.open).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error',
      type: 'error',
      message: 'Failed to post'
    }));
  });

});
