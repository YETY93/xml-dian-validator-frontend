import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    NzUploadModule,
    NzButtonModule,
    NzIconModule,
    NzCollapseModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  fileName = input<string>('');
  xml = input<string>('');
  fileLoaded = input<boolean>(false);

  fileSelected = output<{ content: string; file: NzUploadFile }>();
  fileReset = output<void>();

  beforeUpload = (file: NzUploadFile): boolean => {
    const reader = new FileReader();
    reader.onload = () => {
      this.fileSelected.emit({ content: reader.result as string, file });
    };
    reader.readAsText(file as unknown as File);
    return false;
  };

  onReset(): void {
    this.fileReset.emit();
  }
}
