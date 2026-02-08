import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Camera, Upload, Save, FileText, Image as ImageIcon, MapPin, X, Plus } from 'lucide-react';
import { Badge } from './ui/badge';

interface Observation {
  id: string;
  treeId: string;
  userId: string;
  userName: string;
  date: string;
  health: string;
  notes: string;
  photos: string[];
  location: string;
  synced: boolean;
}

interface FieldDataPageProps {
  currentUser: any;
}

export function FieldDataPage({ currentUser }: FieldDataPageProps) {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    treeId: '',
    health: 'healthy',
    notes: '',
    location: '',
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    // Load observations from localStorage
    const savedObservations = localStorage.getItem('fieldObservations');
    if (savedObservations) {
      const obs = JSON.parse(savedObservations);
      setObservations(obs);
      setPendingSync(obs.filter((o: Observation) => !o.synced).length);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newObservation: Observation = {
      id: Date.now().toString(),
      treeId: formData.treeId,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toISOString(),
      health: formData.health,
      notes: formData.notes,
      photos: photos,
      location: formData.location || 'GPS coordinates unavailable',
      synced: navigator.onLine,
    };

    const updatedObservations = [newObservation, ...observations];
    setObservations(updatedObservations);
    localStorage.setItem('fieldObservations', JSON.stringify(updatedObservations));

    if (!navigator.onLine) {
      setPendingSync(prev => prev + 1);
    }

    // Reset form
    setFormData({
      treeId: '',
      health: 'healthy',
      notes: '',
      location: '',
    });
    setPhotos([]);
    setShowAddForm(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPhotos.push(event.target.result as string);
            if (newPhotos.length === files.length) {
              setPhotos([...photos, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
          setFormData({ ...formData, location });
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const syncData = () => {
    if (!navigator.onLine) {
      alert('Cannot sync while offline. Data will sync automatically when connection is restored.');
      return;
    }

    const updatedObservations = observations.map(obs => ({ ...obs, synced: true }));
    setObservations(updatedObservations);
    localStorage.setItem('fieldObservations', JSON.stringify(updatedObservations));
    setPendingSync(0);
    alert('All observations synced successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-green-700 text-white px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white">Field Data</h1>
            <p className="text-green-100 text-sm">{observations.length} observations</p>
          </div>
          {pendingSync > 0 && (
            <Button 
              onClick={syncData} 
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Upload className="w-4 h-4 mr-1" />
              Sync {pendingSync}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add Button */}
        <Button 
          onClick={() => setShowAddForm(true)}
          className="w-full bg-green-600 hover:bg-green-700 h-14"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Observation
        </Button>

        {/* Observations List */}
        {observations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No observations recorded yet.</p>
              <p className="text-sm mt-2">Tap the button above to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {observations.map((obs) => (
              <Card key={obs.id} className={!obs.synced ? 'border-orange-300 bg-orange-50' : ''}>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className="bg-green-600">Tree #{obs.treeId}</Badge>
                    <Badge 
                      variant="outline"
                      className={
                        obs.health === 'healthy' ? 'border-green-600 text-green-600' :
                        obs.health === 'at-risk' ? 'border-yellow-600 text-yellow-600' :
                        'border-red-600 text-red-600'
                      }
                    >
                      {obs.health}
                    </Badge>
                    {!obs.synced && (
                      <Badge variant="outline" className="border-orange-500 text-orange-600">
                        Pending Sync
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm mb-3">{obs.notes}</p>
                  
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>By {obs.userName}</p>
                    <p>{new Date(obs.date).toLocaleDateString()} at {new Date(obs.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {obs.location}
                    </p>
                    {obs.photos.length > 0 && (
                      <p className="flex items-center">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {obs.photos.length} photo(s)
                      </p>
                    )}
                  </div>
                  
                  {obs.photos.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {obs.photos.map((photo, index) => (
                        <div key={index} className="aspect-square">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Observation Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-6">
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2>New Observation</h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ treeId: '', health: 'healthy', notes: '', location: '' });
                    setPhotos([]);
                  }}
                  className="p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="treeId">Tree ID</Label>
                    <Input
                      id="treeId"
                      placeholder="e.g., 123"
                      value={formData.treeId}
                      onChange={(e) => setFormData({ ...formData, treeId: e.target.value })}
                      required
                      className="h-12 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="health">Health Status</Label>
                    <select
                      id="health"
                      className="w-full border border-gray-300 rounded-md p-3 h-12 bg-white mt-2"
                      value={formData.health}
                      onChange={(e) => setFormData({ ...formData, health: e.target.value })}
                    >
                      <option value="healthy">Healthy</option>
                      <option value="at-risk">At Risk</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      id="location"
                      placeholder="GPS or description"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-12"
                    />
                    <Button type="button" onClick={captureLocation} size="icon" className="h-12 w-12 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Observations & Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Describe condition, diseases, pests..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Photos</Label>
                  <div className="mt-2 space-y-3">
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer active:bg-gray-50">
                        <Camera className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Tap to add photos</p>
                        <p className="text-xs text-gray-400 mt-1">Works offline</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative aspect-square">
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 h-12">
                    <Save className="w-5 h-5 mr-2" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({ treeId: '', health: 'healthy', notes: '', location: '' });
                      setPhotos([]);
                    }}
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
