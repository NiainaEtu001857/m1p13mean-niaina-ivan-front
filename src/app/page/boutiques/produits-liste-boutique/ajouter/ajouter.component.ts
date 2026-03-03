import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ajouter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.css',
})
export class AjouterComponent {
  isSubmitting = false;
  attributes: Array<{ key: string; value: string }> = [{ key: '', value: '' }];

  productForm = {
    name: '',
    category: '',
    min_quantity: null as number | null,
    sale_price: null as number | null,
    description: '',
    image: null as File | null,
    base_unity: '',
  };

  constructor(private http: HttpClient) {}

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.productForm.image = input.files && input.files.length ? input.files[0] : null;
  }

  addAttributeRow() {
    this.attributes.push({ key: '', value: '' });
  }

  removeAttributeRow(index: number) {
    if (this.attributes.length === 1) {
      this.attributes[0] = { key: '', value: '' };
      return;
    }
    this.attributes.splice(index, 1);
  }

  get hasInvalidAttribute(): boolean {
    return this.attributes.some(
      (attr) =>
        (attr.key.trim().length > 0 && attr.value.trim().length === 0) ||
        (attr.key.trim().length === 0 && attr.value.trim().length > 0)
    );
  }

  async submit(event: Event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez vous connecter.');
      return;
    }

    if (!this.productForm.name || !this.productForm.category) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    if (!this.productForm.image) {
      alert('Veuillez ajouter une photo du produit.');
      return;
    }

    const minQuantity = Number(this.productForm.min_quantity?? 1);
    if (!Number.isFinite(minQuantity) || minQuantity <= 0) {
      alert('La quantité minimal de la commande doit etre superieur a 0.');
      return;
    }

    const salePrice = Number(this.productForm.sale_price ?? -1);
    if (!Number.isFinite(salePrice) || salePrice < 0) {
      alert('Le prix de vente doit être un nombre positif.');
      return;
    }

    if (this.hasInvalidAttribute) {
      alert('Chaque attribut doit avoir une clé et une valeur.');
      return;
    }

    const cleanedAttributes = this.attributes
      .map((attr) => ({
        key: attr.key.trim(),
        value: attr.value.trim(),
      }))
      .filter((attr) => attr.key.length > 0 && attr.value.length > 0);

    const formData = new FormData();
    formData.append('name', this.productForm.name.trim());
    formData.append('type', this.productForm.category);
    formData.append('min_quantity', String(minQuantity));
    formData.append('sale_price', String(salePrice));
    formData.append('base_unity', this.productForm.base_unity || 'Unite');
    formData.append('detail', this.productForm.description?.trim() || '');
    formData.append('photo', this.productForm.image, this.productForm.image.name);
    formData.append('attributes', JSON.stringify(cleanedAttributes));

    this.isSubmitting = true;
    try {
      await firstValueFrom(
        this.http
          .post(`${environment.api}/shop/service/add`, formData, {
            headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
            }),
          })
          .pipe(timeout(15000))
      );

      alert('Produit ajoute avec succes.');
      this.productForm = {
        name: '',
        category: '',
        min_quantity: null,
        sale_price: null,
        description: '',
        image: null,
        base_unity: 'piece',
      };
      this.attributes = [{ key: '', value: '' }];
    } catch (error: any) {
      if (error?.name === 'TimeoutError') {
        alert("Errur serveur");
        return;
      }
      alert(error?.error?.message || error?.error?.error || 'Erreur serveur');
    } finally {
      this.isSubmitting = false;
    }
  }
}
