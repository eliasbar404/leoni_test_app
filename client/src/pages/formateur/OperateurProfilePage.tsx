import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { User, Users, BookOpen, Calendar, Clock, Phone, MapPin, Mail, Building2, GraduationCap, CheckCircle2, XCircle, Download, Pen, Trash2, Edit, Settings } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface Attendance {
  id: string;
  date: string;
  isPresent: boolean;
}

interface Test {
  id: string;
  title: string;
  date: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  testPoints: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface Group {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  memberCount: number;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  cin: string;
  matricule: string;
  image: string;
  address: string;
  phone: string;
  group: Group;
  formateur: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null;
  attendance: Attendance[];
  tests: Test[];
}


const styles = StyleSheet.create({
  page: { 
    padding: 10,
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 3,
    borderBottom: '2pt solid #2563eb',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: 150,
    height: 150,
    backgroundColor: '#f3f4f6',
    borderRadius: 75,
  },
  title: { 
    fontSize: 28,
    color: '#1e3a8a',
    fontWeight: 'bold',
    marginBottom: 2.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  section: {
    marginBottom: 2,
    padding: 5,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 10,
    color: '#2563eb',
    marginBottom: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 50,
  },
  infoItem: {
    width: '50%',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: '#1f2937',
  },
  table: {
    width: '300px',
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    // padding: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    // padding: 8,
    backgroundColor: '#ffffff',
  },
  tableCell: {
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
  signature: {
    // marginTop: 10,
    // padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  signatureTitle: {
    fontSize: 14,
    color: '#2563eb',
    // marginBottom: 10,
  },
  signatureImage: {
    width: 200,
    height: 100,
    objectFit: 'contain',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 10,
  },
  badgeSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
});

const PDFDocument = ({ userData, signatureDataUrl }: { userData: UserData, signatureDataUrl: string | null }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Rapport de Formation</Text>
          <Text style={styles.subtitle}>Détails de l'opérateur et progression</Text>
        </View>
        {/* {userData.image && (
          <Image
            src={userData.image}
            style={styles.headerRight}
          />
        )} */}
      </View>

      {/* Personal Information */}
      <View style={{height:120}}>
        <Text style={styles.sectionTitle}>Informations Personnelles</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Nom Complet</Text>
            <Text style={styles.value}>{userData.firstName} {userData.lastName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>CIN</Text>
            <Text style={styles.value}>{userData.cin}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Matricule</Text>
            <Text style={styles.value}>{userData.matricule}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Téléphone</Text>
            <Text style={styles.value}>{userData.phone || 'Non spécifié'}</Text>
          </View>

          {/* fromateru */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>Formateur</Text>
            <Text style={styles.value}>{userData.formateur?.lastName} {userData.formateur?.firstName}</Text>
          </View>

          
        {/* Group */}
        <View style={styles.infoItem}>
            <Text style={styles.label}>Groupe</Text>
            <Text style={styles.value}>{userData.group.name}</Text>
          </View>
        </View>

        
      </View>

      {/* Tests Table */}
      
      <View style={{display:"flex" ,flexDirection:"row"}}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Résultats des Tests</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Test</Text>
            <Text style={styles.tableHeaderCell}>Date</Text>
            <Text style={styles.tableHeaderCell}>Score</Text>
            {/* <Text style={styles.tableHeaderCell}>Difficulté</Text> */}
          </View>
          {userData.tests.map((test, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? { backgroundColor: '#f8fafc' } : {}]}>
              <Text style={[styles.tableCell, { flex: 2, textAlign: 'left' }]}>{test.title}</Text>
              <Text style={styles.tableCell}>{new Date(test.date).toLocaleDateString('fr-FR')}</Text>
              <Text style={styles.tableCell}>{test.score}/{test.testPoints}</Text>
              {/* <Text style={styles.tableCell}>
                {test.difficulty}
              </Text> */}
            </View>
          ))}
        </View>
      </View>

      {/* Attendance Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Présences</Text>
        <View style={{width:200}}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Date</Text>
            <Text style={styles.tableHeaderCell}>Statut</Text>
          </View>
          {userData.attendance.map((record, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? { backgroundColor: '#f8fafc' } : {}]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {new Date(record.date).toLocaleDateString('fr-FR')}
              </Text>
              <Text style={[styles.tableCell, record.isPresent ? styles.badgeSuccess : styles.badgeDanger]}>
                {record.isPresent ? 'Présent' : 'Absent'}
              </Text>
            </View>
          ))}
        </View>
      </View>













      </View>


      {/* Signature */}
      {signatureDataUrl && (
        <View style={styles.signature}>
          <Text style={styles.signatureTitle}>Signature de Formateur</Text>
          <Image src={signatureDataUrl} style={styles.signatureImage} />
        </View>
      )}
    </Page>
  </Document>
);


const API_URL = 'http://localhost:3000/apii';

const OperateurProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'attendance' | 'tests'>('attendance');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [editingTest, setEditingTest] = useState<{ id: string; score: number } | null>(null);
  const [editingAttendance, setEditingAttendance] = useState<{ id: string; isPresent: boolean } | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/operateur/${id}`);
        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureDataUrl(null);
    }
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      setSignatureDataUrl(signatureRef.current.toDataURL());
      setShowSignaturePad(false);
    }
  };

  const handleUpdateTest = async (testId: string, newScore: number) => {
    try {
      await axios.put(`${API_URL}/test-attempts/${testId}`, { score: newScore });
      const response = await axios.get(`${API_URL}/operateur/${id}`);
      setUserData(response.data);
      setEditingTest(null);
    } catch (err) {
      console.error('Error updating test:', err);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!window.confirm('Are you sure you want to delete this test attempt?')) return;
    
    try {
      await axios.delete(`${API_URL}/test-attempts/${testId}`);
      const response = await axios.get(`${API_URL}/operateur/${id}`);
      setUserData(response.data);
    } catch (err) {
      console.error('Error deleting test:', err);
    }
  };

  const handleUpdateAttendance = async (attendanceId: string, isPresent: boolean) => {
    try {
      await axios.put(`${API_URL}/attendance/${attendanceId}`, { isPresent });
      const response = await axios.get(`${API_URL}/operateur/${id}`);
      setUserData(response.data);
      setEditingAttendance(null);
    } catch (err) {
      console.error('Error updating attendance:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          {error || 'Something went wrong'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* PDF Download and Signature Buttons */}
        <div className="mb-6 flex gap-4">
          <PDFDownloadLink
            document={<PDFDocument userData={userData} signatureDataUrl={signatureDataUrl} />}
            fileName={`operateur-${userData.matricule}.pdf`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {/* {({ loading }) => (
              <>
                <Download className="w-5 h-5 mr-2" />
                {loading ? 'Génération...' : 'Télécharger Dossier PDF'}
              </>
            )} */}
<Download className="w-5 h-5 mr-2" />
<span>Télécharger Dossier PDF</span>



          </PDFDownloadLink>
          <button
            onClick={() => setShowSignaturePad(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Pen className="w-5 h-5 mr-2" />
            {signatureDataUrl ? 'Modifier Signature' : 'Ajouter Signature'}
          </button>
        </div>

        {/* Signature Modal */}
        {showSignaturePad && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-4">Signature</h3>
              <div className="border border-gray-300 rounded-lg mb-4">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-64'
                  }}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={clearSignature}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Effacer
                </button>
                <button
                  onClick={() => setShowSignaturePad(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={saveSignature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Header */}
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800"></div>

          <div className="px-6 pb-6 mt-10 flex">
          
            <div className="flex flex-col md:flex-row items-center gap-6 -mt-16">
              <img
                src={userData.image}
                alt={`${userData.firstName} ${userData.lastName}`}
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />

              <div className="text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl font-black text-gray-900">
                  {userData.firstName} {userData.lastName}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    CIN: {userData.cin}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    Matricule: {userData.matricule}
                  </span>
                </div>
              </div>

              <Link className='relative left-10' to={`/formateur/dashboard/operateur/${id}/edit`}><Settings color='blue' size={50}/></Link>

            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Contact & Group Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Informations de Contact</h2>
              <div className="space-y-4">
                {userData.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>{userData.phone}</span>
                  </div>
                )}
                {userData.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{userData.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Group Information */}
            {userData.group && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Groupe</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{userData.group.name}</p>
                      <p className="text-sm text-gray-600">{userData.group.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">Détails du Groupe:</p>
                    <div className="grid grid-cols-2 gap-4">

                      <div>
                        <p className="text-xs w-full font-medium flex gap-2 items-center">Nombre d'Opérateurs: <span className='text-sm'>{userData.group.memberCount}</span></p>
    
    
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formateur Information */}
            {userData.formateur && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Formateur</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {userData.formateur.firstName} {userData.formateur.lastName}
                      </p>
                    </div>
                  </div>
                  {userData.formateur.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <span>{userData.formateur.phone}</span>
                    </div>
                  )}
                  {userData.formateur.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span>{userData.formateur.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Attendance & Tests */}
          <div className="md:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'attendance'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Calendar className="w-5 h-5 inline-block mr-2" />
                    Présences
                  </button>
                  <button
                    onClick={() => setActiveTab('tests')}
                    className={`px-6 py-4 text-sm font-medium ${
                      activeTab === 'tests'
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 inline-block mr-2" />
                    Tests
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'attendance' ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Historique des Présences</h3>
                <div className="space-y-4">
                  {userData.attendance.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span>{new Date(record.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {editingAttendance?.id === record.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editingAttendance.isPresent ? 'present' : 'absent'}
                            onChange={(e) => setEditingAttendance({
                              ...editingAttendance,
                              isPresent: e.target.value === 'present'
                            })}
                            className="rounded border-gray-300"
                          >
                            <option value="present">Présent</option>
                            <option value="absent">Absent</option>
                          </select>
                          <button
                            onClick={() => handleUpdateAttendance(record.id, editingAttendance.isPresent)}
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditingAttendance(null)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 ${
                            record.isPresent ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {record.isPresent ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                            {record.isPresent ? 'Présent' : 'Absent'}
                          </span>
                          <button
                            onClick={() => setEditingAttendance({
                              id: record.id,
                              isPresent: record.isPresent
                            })}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Historique des Tests</h3>
                <div className="space-y-4">
                  {userData.tests.map((test) => (
                    <div key={test.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{test.title}</h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingTest({
                              id: test.id,
                              score: test.score
                            })}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTest(test.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">
                            {new Date(test.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Score</p>
                          {editingTest?.id === test.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max={test.testPoints}
                                value={editingTest.score}
                                onChange={(e) => setEditingTest({
                                  ...editingTest,
                                  score: Number(e.target.value)
                                })}
                                className="w-20 rounded border-gray-300"
                              />
                              <span className="text-sm text-gray-600">/ {test.testPoints}</span>
                              <button
                                onClick={() => handleUpdateTest(test.id, editingTest.score)}
                                className="p-1 text-green-600 hover:text-green-800"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setEditingTest(null)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <p className="font-medium">{test.score} / {test.testPoints}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Difficulté</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            test.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                            test.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {test.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperateurProfilePage;