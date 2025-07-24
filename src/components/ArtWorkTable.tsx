import { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator, type PaginatorPageChangeEvent } from 'primereact/paginator';
import axios from 'axios';
import { SelectionPanel } from './SelectionPanel';
import type { Artwork, ArtworkApiResponse } from '../types/artwork';

const API_URL = 'https://api.artic.edu/api/v1/artworks';

export const ArtworkTable = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const tableRef = useRef<DataTable<Artwork[]>>(null);

  const fetchArtworks = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get<ArtworkApiResponse>(`${API_URL}?page=${page}`);
      const { data, pagination } = response.data;

      const transformedData = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled',
        place_of_origin: item.place_of_origin || 'Unknown',
        artist_display: item.artist_display || 'Unknown artist',
        inscriptions: item.inscriptions || 'No inscriptions',
        date_start: item.date_start || 0,
        date_end: item.date_end || 0,
      }));

      setArtworks(transformedData);
      setTotalRecords(pagination.total);
      setCurrentPage(pagination.current_page);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(1);
  }, []);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    fetchArtworks(event.page + 1);
    setSelectedArtworks([]); // Reset selection on page change
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
    setSelectedArtworks(e.value);
  };

  const onToggleAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectedArtworks(artworks); // Select all on current page
    } else {
      setSelectedArtworks([]); // Clear selection
    }
  };

  const isRowSelected = (artwork: Artwork) => {
    return selectedArtworks.some(selected => selected.id === artwork.id);
  };

  const rowClassName = (artwork: Artwork) => {
    return isRowSelected(artwork) ? 'bg-blue-50' : '';
  };

  return (
    <div className="card">
      <SelectionPanel
        tableRef={tableRef}
        selectedArtworks={new Set(selectedArtworks.map(a => a.id))}
        totalRecords={totalRecords}
        onToggleAll={onToggleAll}
      />

      <DataTable
        ref={tableRef}
        value={artworks}
        loading={loading}
        selectionMode="checkbox"
        dataKey="id"
        responsiveLayout="scroll"
        rowClassName={rowClassName}
        selection={selectedArtworks}
        onSelectionChange={onSelectionChange}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="title" header="Title" sortable />
        <Column field="place_of_origin" header="Origin" sortable />
        <Column field="artist_display" header="Artist" sortable />
        <Column field="inscriptions" header="Inscriptions" sortable />
        <Column
          header="Date"
          body={(data: Artwork) => `${data.date_start} - ${data.date_end}`}
          sortable
          sortField="date_start"
        />
      </DataTable>

      <Paginator
        first={(currentPage - 1) * 10}
        rows={10}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      />
    </div>
  );
};
