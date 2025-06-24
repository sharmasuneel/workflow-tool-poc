import {
  Component, ComponentFactoryResolver, Input, OnInit, ViewContainerRef,
  ViewChild,
  ComponentRef,
  createComponent,
  Injector,
  ApplicationRef,
  inject,
} from '@angular/core';
import Drawflow from 'drawflow';
import nodesData from './nodes.json'; // Assuming you have a JSON file with node data
import { CommonModule } from '@angular/common';
// TODO import draggable components here
import { UploadComponent, DownloadComponent, ReviewComponent, AttestComponent, StartComponent } from '../../draggableComponents/index';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';


import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import getConfig from '../../config';
import { AppService } from '../../services/app.service';
import { toFormData } from '../../utils/dataTransformer'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ToastComponent } from '../../common/toast/toast.component';

type NodeName = keyof typeof nodesData.nodes;

@Component({
  selector: 'app-drawflow',
  templateUrl: './drawflow.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ToastComponent],
  styleUrls: ['./drawflow.component.css']
})
export class DrawflowComponent implements OnInit {


  @ViewChild('hello', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @Input()
  nodes: any[];
  @Input()
  drawingData: string;
  @Input()
  locked: boolean;
  @Input()
  showLock: boolean;
  @Input()
  showNodes: boolean = false;
  @Input()
  otherDetails: any;

  editor!: any;
  editDivHtml: HTMLElement;
  editButtonShown: boolean = false;

  drawnNodes: any[] = [];
  selectedNodeId: string;
  selectedNode: any = {};

  lastMousePositionEv: any;

  mobile_item_selec: string;
  mobile_last_move: TouchEvent | null;
  draggableNodes: any = nodesData.nodes
  users: string[] = ['User A', 'User B', 'User C'];

  workflowName: string = '';
  private dataService = inject(DataService);
  private appService = inject(AppService);

  showToast: boolean = false;
  toastMsg: string = '';

  private workflowId: any = 0;

  constructor(private injector: Injector, private appRef: ApplicationRef, private route: ActivatedRoute, private router: Router) { }

  onWorkflowNameChange(event: any) {
    this.workflowName = event.target.value;
    this.workflowId = uuidv4(); // Generate a unique ID for the workflow
    console.log('Workflow Name Changed:', this.workflowName, this.workflowId);
  }

  toDashboard() {
    this.router.navigate(['']);
  }
  logout() {
    this.appService.setUser(null)
    this.router.navigate(['']);
  }

  drawflowData: any = null
  selectedRole: string = ''
  action: string = 'create'
  workflowType: string

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any) => {
      console.log('Query Params:', queryParams);
      const { id, action, name, selectedRole, workflowType } = queryParams
      this.selectedRole = selectedRole
      this.action = action
      if (action === 'execute' && id) {
        this.workflowType = workflowType
        this.drawflowData = this.appService.getWorkflows().find((dd: any) => {
          return dd.workflowId === Number(id)
        }).drawflow

      }
    });
  }

  onUploadClick() {
    // Handle upload click
    alert('Upload clicked');
    console.log('Upload clicked');
  }

  ngAfterViewInit(): void {
    this.initDrawingBoard();
    if (this.drawflowData) {
      if (this.action === 'execute') {
        this.editor.editor_mode = 'fixed'
        this.isDraggable = true
      }
      this.editor.clear()
      this.editor.drawflow = this.drawflowData
      this.editor.load();
    }
  }

  // this.editor.editor_mode = this.locked != null && this.locked == false ? 'edit' : 'fixed';


  private initDrawingBoard() {
    this.initDrawFlow();
    if (!this.locked) {
      this.addEditorEvents();
      this.dragEvent();
    }
  }

  isDraggable: boolean = true

  private addComponents<T>(nodeData: any, id: string, innerHTML: string, nodeId: string, customComponent: { new(...args: any[]): T }): void {
    const isNodeEnabled = this.appService.getEnabledNodes(this.selectedRole).includes(id)
    if (nodeData && nodeData.class === id && isNodeEnabled) {
      // Dynamically render UploadComponent inside the node
      const nodeContent = document.querySelector(`#node-${nodeId} .drawflow_content_node`);
      const container = nodeContent?.children[1];
      if (nodeContent && !nodeContent.querySelector('app-upload') && container?.innerHTML === innerHTML) {
        if (!container) {
          console.error('Element not found:' + id);
          return;
        }
        const componentRef: ComponentRef<T> = createComponent(customComponent, {
          environmentInjector: this.appRef.injector,
        });
    (componentRef.instance as any).uiTaskId = nodeData.data.uiTaskId; // Pass the unique ID to the component instance
    (componentRef.instance as any).workflowType = this.workflowType; // Pass the unique ID to the component instance


        this.appRef.attachView(componentRef.hostView);
        container.innerHTML = '';
         // Optional: clear existing content
        container.appendChild((componentRef.hostView as any).rootNodes[0]);
      }
    }
    // Dynamically add components if needed 
  }

  // Private functions
  private initDrawFlow(): void {
    if (typeof document !== 'undefined') {
      const drawFlowHtmlElement = document.getElementById('drawflow');
      this.editor = new Drawflow(drawFlowHtmlElement as HTMLElement);

      this.editor.reroute = true;
      this.editor.curvature = 0.5;
      this.editor.reroute_fix_curvature = true;
      this.editor.reroute_curvature = 0.5;
      this.editor.force_first_input = false;
      this.editor.line_path = 1;
      this.editor.editor_mode = 'edit';

      this.editor.start();

      this.editor.createCurvature = function (start_pos_x: any, start_pos_y: any, end_pos_x: any, end_pos_y: any, curvature_value: any, type: any) {
        var line_x = start_pos_x;
        var line_y = start_pos_y;
        var x = end_pos_x;
        var y = end_pos_y;
        var curvature = curvature_value;
        switch (type) {
          default:
            var hx1 = line_x + Math.abs(x - line_x) * curvature;
            var hx2 = x - Math.abs(x - line_x) * curvature;
            return ' M ' + line_x + ' ' + line_y + ' C ' + hx1 + ' ' + line_y + ' ' + hx2 + ' ' + y + ' ' + (x - 21) + '  ' + y + ' M ' + (x - 11) + ' ' + y + ' L' + (x - 20) + ' ' + (y - 5) + '  L' + (x - 20) + ' ' + (y + 5) + ' Z' + ' M ' + (x - 11) + ' ' + y + ' L' + (x - 20) + ' ' + (y - 3) + '  L' + (x - 20) + ' ' + (y + 3) + ' Z' + ' M ' + (x - 11) + ' ' + y + ' L' + (x - 20) + ' ' + (y - 1) + '  L' + (x - 20) + ' ' + (y + 1) + ' Z';
        }
      }


    }
  }

  private addEditorEvents() {
    // Events!
    this.editor.on('nodeCreated', (id: any) => {
      console.log('Editor Event :>> Node created ' + id, this.editor.getNodeFromId(id));
    });

    this.editor.on('nodeRemoved', (id: any) => {
      console.log('Editor Event :>> Node removed ' + id);
    });

    this.editor.on('nodeSelected', (id: any) => {
      console.log('Editor Event :>> Node selected ' + id, this.editor.getNodeFromId(id));
      this.selectedNode = this.editor.drawflow.drawflow.Home.data[`${id}`];
      console.log('Editor Event :>> Node selected :>> this.selectedNode :>> ', this.selectedNode);
      console.log('Editor Event :>> Node selected :>> this.selectedNode :>> ', this.selectedNode.data);
    });

    this.editor.on('click', (e: any) => {
      // debugger
      console.log('Editor Event :>> Click :>> ', e);
      if (e.target.closest('.drawflow_content_node') != null) {
        const nodeId = e.target.closest('.drawflow_content_node').parentElement.id.slice(5);
        const nodeData = this.editor.drawflow.drawflow.Home.data[nodeId];
        //TODO add dragabble components here
        if (nodeData) {
          if (nodeData.class === 'upload') {
            this.addComponents<UploadComponent>(nodeData, 'upload', 'Upload', nodeId, UploadComponent);
          } else if (nodeData.class === 'download') {
            this.addComponents<DownloadComponent>(nodeData, 'download', 'Download', nodeId, DownloadComponent);
          }
          else if (nodeData.class === 'review') {
            this.addComponents<ReviewComponent>(nodeData, 'review', 'Review', nodeId, ReviewComponent);
          } else if (nodeData.class === 'attestation') {
            this.addComponents<AttestComponent>(nodeData, 'attestation', 'Attestation', nodeId, AttestComponent);
          }
          else if (nodeData.class === 'start') {
            this.addComponents<StartComponent>(nodeData, 'start', 'Start', nodeId, StartComponent);
          }
        }
      }
      if (e.target.closest('.drawflow_content_node') != null || e.target.classList[0] === 'drawflow-node') {
        if (e.target.closest('.drawflow_content_node') != null) {
          this.selectedNodeId = e.target.closest('.drawflow_content_node').parentElement.id;
        } else {
          this.selectedNodeId = e.target.id;
        }
        this.selectedNode = this.editor.drawflow.drawflow.Home.data[`${this.selectedNodeId.slice(5)}`];
      }

      if (e.target.closest('#editNode') != null || e.target.classList[0] === 'edit-node-button') {
        // Open modal with Selected Node
        // this.open(this.nodeModal, this.selectedNodeId);
      }

      if (e.target.closest('#editNode') === null) {
        this.hideEditButton();
      }
    });

    this.editor.on('moduleCreated', (name: any) => {
      console.log('Editor Event :>> Module Created ' + name);
    });

    this.editor.on('moduleChanged', (name: any) => {
      console.log('Editor Event :>> Module Changed ' + name);
    });

    this.editor.on('connectionCreated', (connection: any) => {
      console.log('Editor Event :>> Connection created ', connection);
    });

    this.editor.on('connectionRemoved', (connection: any) => {
      console.log('Editor Event :>> Connection removed ', connection);
    });

    // this.editor.on('contextmenu', (e: any) => {
    //   console.log('Editor Event :>> Context Menu :>> ', e);

    //   if (e.target.closest('.drawflow_content_node') != null || e.target.classList[0] === 'drawflow-node') {
    //     if (e.target.closest('.drawflow_content_node') != null) {
    //       this.selectedNodeId = e.target.closest('.drawflow_content_node').parentElement.id;
    //     } else {
    //       this.selectedNodeId = e.target.id;
    //     }
    //     this.selectedNode = this.editor.drawflow.drawflow.Home.data[`${this.selectedNodeId.slice(5)}`];

    //     // this.showEditButton();
    //   }
    // });

    this.editor.on('zoom', (zoom: any) => {
      console.log('Editor Event :>> Zoom level ' + zoom);
    });

    this.editor.on('addReroute', (id: any) => {
      console.log('Editor Event :>> Reroute added ' + id);
    });

    this.editor.on('removeReroute', (id: any) => {
      console.log('Editor Event :>> Reroute removed ' + id);
    });

    this.editor.on('mouseMove', (position: any) => {
      //console.log('Editor Event :>> Position mouse x:' + position.x + ' y:' + position.y);
    });

    this.editor.on('nodeMoved', (id: any) => {
      console.log('Editor Event :>> Node moved ' + id);
    });

    this.editor.on('translate', (position: any) => {
      console.log(
        'Editor Event :>> Translate x:' + position.x + ' y:' + position.y
      );
    });
  }

  private dragEvent() {
    var elements = Array.from(document.getElementsByClassName('drag-drawflow'));
    elements.forEach(element => {
      element.addEventListener('touchend', this.drop.bind(this), false);
      element.addEventListener('touchmove', this.positionMobile.bind(this), false);
      element.addEventListener('touchstart', this.drag.bind(this), false);
      element.addEventListener("dblclick", (event) => { });
    });
  }

  private positionMobile(ev: any) {
    this.mobile_last_move = ev;
  }

  public allowDrop(ev: any) {
    ev.preventDefault();
  }

  drag(ev: any) {
    if (ev.type === "touchstart") {
      this.selectedNode = ev.target.closest(".drag-drawflow").getAttribute('data-node');
    } else {
      ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
    }
  }

  drop(ev: any) {
    if (ev.type === "touchend" && this.mobile_last_move) {
      var parentdrawflow = document.elementFromPoint(this.mobile_last_move.touches[0].clientX, this.mobile_last_move.touches[0].clientY)?.closest("#drawflow");
      if (parentdrawflow != null) {
        this.addNodeToDrawFlow(this.mobile_item_selec, this.mobile_last_move.touches[0].clientX, this.mobile_last_move.touches[0].clientY);
      }
      this.mobile_item_selec = '';
    } else {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("node");
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  private addNodeToDrawFlow(id: string, pos_x: number, pos_y: number) {
    if (this.editor.editor_mode === 'fixed') {
      return false;
    }

    pos_x = pos_x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)));
    pos_y = pos_y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)));
    const node = nodesData.nodes.filter(node => node.id === id)[0] as { class: string, inputs: any, outputs: any, data: any, html: string };
    // TODO Left nav icons when dropped.. node.json html -->
    if(!node.data.uiTaskId) {
      node.data = { ...node.data, uiTaskId: uuidv4() }; // Generate a unique ID for the node
    }
    if (node) { 
      this.editor.addNode(
        node.class,
        node.inputs,
        node.outputs,
        pos_x,
        pos_y,
        node.class,
        node.data,
        node.html
      );
    }

    return true;
  }

  export() {
    // debugger
    const html = JSON.stringify(this.editor.export(), null, 4)
  }
  // TODO save workflow
  saveWorkflow() {
    const payload = this.appService.getNewWorkflow()
    debugger
    const data = toFormData({ files: payload.files, metadata: JSON.stringify(payload) }, payload.uploadType)
    this.dataService.postData(getConfig().saveWorkflowWithId, data).subscribe((response) => {
      console.log('Workflow saved successfully:', response);
      //TODO show alert message
      this.showToast = true
      this.toastMsg = 'Workflow saved successfully'
    })
    /* const payload = this.appService.getWorkFlowPayload()
    const drawFlowData = this.editor.export();
    payload.metadata = { ...payload.metadata, drawflow: JSON.stringify(this.editor.export(), null, 4) }
    const data = toFormData({ files: payload.files, metadata: JSON.stringify(payload.metadata) }, '')
    this.dataService.postData(getConfig().saveWorkflowWithId, data).subscribe((response) => {
      console.log('Workflow saved successfully:', response);
      //TODO show alert message
      this.showToast = true
      this.toastMsg = 'Workflow saved successfully'
    }) */
  }

  onClear() {
    this.editor.clear();
  }

  changeMode() {
    debugger
    this.locked = !this.locked;
    this.editor.editor_mode = this.locked != null && this.locked == false ? 'edit' : 'fixed';
  }

  onZoomOut() {
    this.editor.zoom_out();
  }

  onZoomIn() {
    this.editor.zoom_in();
  }

  onZoomReset() {
    this.editor.zoom_reset();
  }

  exportDrawingData() {
    return this.editor.export();
  }

  onSubmit() {
    this.drawingData = this.exportDrawingData();
  }


  private hideEditButton() {
    this.editButtonShown = false;
    this.editDivHtml = document.getElementById('editNode')!;
    if (this.editDivHtml) {
      this.editDivHtml.remove();
    }
  }

}

