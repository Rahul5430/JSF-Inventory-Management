import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
	en: {
		translation: {
			// Navigation
			'nav.dashboard': 'Dashboard',
			'nav.inventory': 'Inventory',
			'nav.staff': 'Staff',
			'nav.reports': 'Reports',
			'nav.settings': 'Settings',
			'nav.logout': 'Logout',

			// Common
			'common.add': 'Add',
			'common.edit': 'Edit',
			'common.delete': 'Delete',
			'common.save': 'Save',
			'common.cancel': 'Cancel',
			'common.search': 'Search',
			'common.filter': 'Filter',
			'common.export': 'Export',
			'common.import': 'Import',
			'common.loading': 'Loading...',
			'common.noData': 'No data found',
			'common.confirm': 'Confirm',
			'common.yes': 'Yes',
			'common.no': 'No',

			// Inventory
			'inventory.title': 'Inventory Management',
			'inventory.addItem': 'Add Item',
			'inventory.editItem': 'Edit Item',
			'inventory.name': 'Name',
			'inventory.quantity': 'Quantity',
			'inventory.cost': 'Cost',
			'inventory.location': 'Location',
			'inventory.expiryDate': 'Expiry Date',
			'inventory.donor': 'Donor',
			'inventory.purpose': 'Purpose',
			'inventory.category': 'Category',
			'inventory.minStockLevel': 'Minimum Stock Level',
			'inventory.unit': 'Unit',
			'inventory.category.medicine': 'Medicine',
			'inventory.category.equipment': 'Equipment',
			'inventory.category.supplies': 'Supplies',

			// Staff
			'staff.title': 'Staff Management',
			'staff.addMember': 'Add Staff Member',
			'staff.editMember': 'Edit Staff Member',
			'staff.name': 'Name',
			'staff.role': 'Role',
			'staff.specialty': 'Specialty',
			'staff.shiftStart': 'Shift Start',
			'staff.shiftEnd': 'Shift End',
			'staff.patientsServed': 'Patients Served',
			'staff.location': 'Location',
			'staff.contactNumber': 'Contact Number',
			'staff.email': 'Email',
			'staff.isActive': 'Active',
			'staff.role.doctor': 'Doctor',
			'staff.role.nurse': 'Nurse',
			'staff.role.volunteer': 'Volunteer',
			'staff.role.coordinator': 'Coordinator',
			'staff.role.admin': 'Admin',

			// Alerts
			'alerts.lowStock': 'Low Stock Alert',
			'alerts.expiry': 'Expiry Alert',
			'alerts.system': 'System Alert',

			// Reports
			'reports.title': 'Reports',
			'reports.inventory': 'Inventory Report',
			'reports.staff': 'Staff Report',
			'reports.usage': 'Usage Report',

			// Authentication
			'auth.login': 'Login',
			'auth.register': 'Register',
			'auth.email': 'Email',
			'auth.password': 'Password',
			'auth.confirmPassword': 'Confirm Password',
			'auth.name': 'Name',
			'auth.role': 'Role',
			'auth.forgotPassword': 'Forgot Password?',
			'auth.noAccount': "Don't have an account?",
			'auth.hasAccount': 'Already have an account?',

			// Messages
			'message.itemAdded': 'Item added successfully',
			'message.itemUpdated': 'Item updated successfully',
			'message.itemDeleted': 'Item deleted successfully',
			'message.staffAdded': 'Staff member added successfully',
			'message.staffUpdated': 'Staff member updated successfully',
			'message.staffDeleted': 'Staff member deleted successfully',
			'message.error': 'An error occurred',
			'message.success': 'Operation completed successfully',
		},
	},
	hi: {
		translation: {
			// Navigation
			'nav.dashboard': 'डैशबोर्ड',
			'nav.inventory': 'इन्वेंटरी',
			'nav.staff': 'कर्मचारी',
			'nav.reports': 'रिपोर्ट',
			'nav.settings': 'सेटिंग्स',
			'nav.logout': 'लॉगआउट',

			// Common
			'common.add': 'जोड़ें',
			'common.edit': 'संपादित करें',
			'common.delete': 'हटाएं',
			'common.save': 'सहेजें',
			'common.cancel': 'रद्द करें',
			'common.search': 'खोजें',
			'common.filter': 'फ़िल्टर',
			'common.export': 'निर्यात',
			'common.import': 'आयात',
			'common.loading': 'लोड हो रहा है...',
			'common.noData': 'कोई डेटा नहीं मिला',
			'common.confirm': 'पुष्टि करें',
			'common.yes': 'हाँ',
			'common.no': 'नहीं',

			// Inventory
			'inventory.title': 'इन्वेंटरी प्रबंधन',
			'inventory.addItem': 'आइटम जोड़ें',
			'inventory.editItem': 'आइटम संपादित करें',
			'inventory.name': 'नाम',
			'inventory.quantity': 'मात्रा',
			'inventory.cost': 'लागत',
			'inventory.location': 'स्थान',
			'inventory.expiryDate': 'समाप्ति तिथि',
			'inventory.donor': 'दानदाता',
			'inventory.purpose': 'उद्देश्य',
			'inventory.category': 'श्रेणी',
			'inventory.minStockLevel': 'न्यूनतम स्टॉक स्तर',
			'inventory.unit': 'इकाई',
			'inventory.category.medicine': 'दवा',
			'inventory.category.equipment': 'उपकरण',
			'inventory.category.supplies': 'सामग्री',

			// Staff
			'staff.title': 'कर्मचारी प्रबंधन',
			'staff.addMember': 'कर्मचारी जोड़ें',
			'staff.editMember': 'कर्मचारी संपादित करें',
			'staff.name': 'नाम',
			'staff.role': 'भूमिका',
			'staff.specialty': 'विशेषज्ञता',
			'staff.shiftStart': 'शिफ्ट शुरू',
			'staff.shiftEnd': 'शिफ्ट समाप्त',
			'staff.patientsServed': 'रोगियों की सेवा',
			'staff.location': 'स्थान',
			'staff.contactNumber': 'संपर्क संख्या',
			'staff.email': 'ईमेल',
			'staff.isActive': 'सक्रिय',
			'staff.role.doctor': 'डॉक्टर',
			'staff.role.nurse': 'नर्स',
			'staff.role.volunteer': 'स्वयंसेवक',
			'staff.role.coordinator': 'समन्वयक',
			'staff.role.admin': 'प्रशासक',

			// Alerts
			'alerts.lowStock': 'कम स्टॉक चेतावनी',
			'alerts.expiry': 'समाप्ति चेतावनी',
			'alerts.system': 'सिस्टम चेतावनी',

			// Reports
			'reports.title': 'रिपोर्ट',
			'reports.inventory': 'इन्वेंटरी रिपोर्ट',
			'reports.staff': 'कर्मचारी रिपोर्ट',
			'reports.usage': 'उपयोग रिपोर्ट',

			// Authentication
			'auth.login': 'लॉगिन',
			'auth.register': 'पंजीकरण',
			'auth.email': 'ईमेल',
			'auth.password': 'पासवर्ड',
			'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
			'auth.name': 'नाम',
			'auth.role': 'भूमिका',
			'auth.forgotPassword': 'पासवर्ड भूल गए?',
			'auth.noAccount': 'खाता नहीं है?',
			'auth.hasAccount': 'पहले से खाता है?',

			// Messages
			'message.itemAdded': 'आइटम सफलतापूर्वक जोड़ा गया',
			'message.itemUpdated': 'आइटम सफलतापूर्वक अपडेट किया गया',
			'message.itemDeleted': 'आइटम सफलतापूर्वक हटाया गया',
			'message.staffAdded': 'कर्मचारी सफलतापूर्वक जोड़ा गया',
			'message.staffUpdated': 'कर्मचारी सफलतापूर्वक अपडेट किया गया',
			'message.staffDeleted': 'कर्मचारी सफलतापूर्वक हटाया गया',
			'message.error': 'एक त्रुटि हुई',
			'message.success': 'कार्य सफलतापूर्वक पूरा हुआ',
		},
	},
};

// Initialize i18n only on client side
if (typeof window !== 'undefined' && !i18n.isInitialized) {
	i18n.use(LanguageDetector)
		.use(initReactI18next)
		.init({
			resources,
			fallbackLng: 'en',
			debug: process.env.NODE_ENV === 'development',

			interpolation: {
				escapeValue: false,
			},

			detection: {
				order: ['localStorage', 'navigator'],
				caches: ['localStorage'],
			},
		});
}

export default i18n;
