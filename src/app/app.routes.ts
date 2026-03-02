import { Routes } from '@angular/router';
import { Login } from './page/login/login/login';
import { Registre } from './page/login/registre/registre';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { BoutiqueLayoutComponent } from './layouts/boutique-layout/boutique-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            {
                path:'',
                loadComponent() {
                    return import('./page/admin/dashboard/dashboard.component').then(m => m.DashboardComponent);
                },    
            },
            {
                path:'produits',
                loadComponent() {
                    return import('./page/admin/produits/produits.component').then(m => m.ProduitsComponent);
                }
            },
            {
                path: 'clients',
                loadComponent() {
                    return import('./page/admin/client/client.component').then(m => m.ClientComponent);
                }
            },
            {
                path: 'clients-detail',
                loadComponent() {
                    return import('./page/admin/produits/detail-produit/detail-produit.component').then(m => m.DetailProduitComponent);
                },
            },
            {
                path: 'boutiques',
                loadComponent() {
                    return import('./page/admin/boutiques/boutiques.component').then(m=> m.BoutiquesComponent);
                },
            },
            {
                path:'boutiques/produits',
                loadComponent() {
                    return import('./page/admin/boutiques/produits-boutique/produits-boutique.component').then(m=> m.ProduitsBoutiqueComponent);
                },
            }
        ]
    },
    {
        path: 'boutiques',
        component: BoutiqueLayoutComponent,
        children: [
            {
                path:'',
                loadComponent() {
                    return import('./page/boutiques/dashboard-boutique/dashboard-boutique.component').then(m => m.DashboardBoutiqueComponent);
                },
            },
            {
                path:'produits/ajouter',
                loadComponent() {
                    return import('./page/boutiques/produits-liste-boutique/ajouter/ajouter.component').then(m => m.AjouterComponent);
                }
            },
            {
                path:'produits',
                loadComponent() {
                    return import('./page/boutiques/produits-liste-boutique/produits-liste-boutique.component').then(m => m.ProduitsListeBoutiqueComponent);
                }
            },
            {
                path:'produits/stocks',
                loadComponent() {
                    return import('./page/boutiques/stocks-boutique/stocks-boutique.component').then(m => m.StocksBoutiqueComponent);
                },
            },

            {
                path:'commandes',
                loadComponent() {
                    return import('./page/boutiques/commandes-boutique/commandes-boutique.component').then(m => m.CommandesBoutiqueComponent);
                }
            },
            {
                path:'commandes/ajouter',   
                loadComponent() {
                    return import('./page/boutiques/commandes-boutique/commandes-ajout/commandes-ajout.component').then(m => m.CommandesAjoutComponent);
                }
            },
            {
                path:'commandes/historique',
                loadComponent() {
                    return import('./page/boutiques/commandes-boutique/commandes-historique/commandes-historique.component').then(m => m.CommandesHistoriqueComponent);
                }
            },
            {
                path: 'produits/stocks/ajouter',
                loadComponent()
                {
                    return import('./page/boutiques/stocks-boutique/ajouter/ajouter-stock.component').then(m => m.AjouterStockComponent);
                },
            },
        ]
    },
    {
        path: 'client',
        component: ClientLayoutComponent,
        children: [
            {
                path: '',
                loadComponent() {
                    return import('./page/client/choose-shop/choose-shop.component').then(m => m.ChooseShopComponent);
                }   
            },

            {
                path: 'shop/:id',
                loadComponent() {
                    return import('./page/client/list-product/list-product.component').then(m => m.ListProductComponent);
                }
            },
            {
                path: 'order/pending',
                loadComponent() {
                    return import('./page/client/order-pending/order-pending.component').then(m => m.OrderPendingComponent);
                }
            }
        ]
    },
    { path: 'login' , component: Login},
    { path: 'register' , component: Registre},
];
