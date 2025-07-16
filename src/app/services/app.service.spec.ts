import { TestBed } from '@angular/core/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be set user tasks', () => {
   service.setUserTasks([{"taskId":111}]);
   const userTasks=service.getUserTasks();
   expect(userTasks).not.toEqual([{"taskId":222}]);
  });
 
  
});
