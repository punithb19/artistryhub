import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule], // Import MatProgressSpinnerModule here
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css']
})
export class CategoryModalComponent implements OnInit {
  loading = true; // Track loading state
  categories: any[] = []; // Store fetched categories

  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; title: string; year: string; thumbnail: string },
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.apiService.getCategories(this.data.id).subscribe(
      (response) => {
        this.categories = response; // Store categories
        this.loading = false; // Stop loading spinner
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.loading = false; // Stop loading spinner even on error
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
