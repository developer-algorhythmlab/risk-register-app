// EGOV's 2024/25 Compliance Universe - the standing list of Acts/Regulations a
// Compliance-type risk is tied to. Sourced from the client's actual Compliance
// Risk Management Plan (2025-26 CRMP - Q4.xlsx, "Compliance Universe" sheet),
// not invented. Category and purpose are properties of the Act itself, so a
// risk only stores which Act it's tied to (see RiskFormModal) - category and
// purpose are looked up from here, never re-typed or duplicated per risk.

export const COMPLIANCE_CATEGORIES = ["Core", "Topical", "Secondary"]

export const COMPLIANCE_UNIVERSE = [
  // Core - primary compliance obligations that apply extensively and relate
  // directly to the department's main operations, services or functioning.
  { name: "Public Finance Management Act, 1999 (Act 1 of 1999)", category: "Core", purpose: "Regulates financial management in the Department to ensure that all revenue, expenditure, assets and liabilities of the Department are managed efficiently and effectively; to provide for the responsibilities of persons entrusted with financial management in the Department and to provide for matters connected therewith." },
  { name: "Cybercrimes Act 19 of 2020", category: "Core", purpose: "To create offences which have a bearing on cybercrime; to criminalise the disclosure of data messages which are harmful; to further regulate jurisdiction, investigation powers and mutual assistance in respect of cybercrimes; to provide for a designated Point of Contact and to impose obligations to report cybercrimes." },
  { name: "Infrastructure Development Act, 2014", category: "Core", purpose: "To provide for the facilitation and co-ordination of public infrastructure development of significant economic or social importance, and to ensure such development is prioritised in planning, approval and implementation." },
  { name: "Electronic Communications and Transactions Act (ECTA), 2002", category: "Core", purpose: "To provide for the facilitation and regulation of electronic communications and transactions, promote universal access, prevent abuse of information systems, and encourage the use of e-government services." },
  { name: "Public Service Act / Public Service Regulations", category: "Core", purpose: "To provide for the organisation and administration of the public service, the regulation of conditions of employment, terms of office, discipline, retirement and discharge of members of the public service." },
  { name: "The National Archives Act, 1996", category: "Core", purpose: "Provides for the archiving, storage and accessibility of information, and for the manner in which government bodies store documents, papers and records." },
  { name: "Corporate Governance of ICT Policy Framework", category: "Core", purpose: "To institutionalise the Corporate Governance of and Governance of ICT as an integral part of corporate governance within departments in a uniform and coordinated manner." },
  { name: "Government Wide Enterprise Architecture Framework", category: "Core", purpose: "Provides guidance to Government CIO/GITO and Enterprise Architecture practitioners to establish and manage an EA Capability and develop an Enterprise Architecture Plan for a department, agency or programme of Government." },
  { name: "Minimum Information Security Standards", category: "Core", purpose: "Provides security measures against unauthorised access to classified information." },
  { name: "Prevention and Combating of Corrupt Activities Act, 2004", category: "Core", purpose: "Makes corruption a crime, covering anyone working for government as well as people outside government." },
  { name: "Electronic Communications Act, 2005", category: "Core", purpose: "To promote convergence in the broadcasting, broadcasting signal distribution and telecommunications sectors and provide the legal framework for regulation of electronic communications services." },
  { name: "Public Administration Management Act (Act 11 of 2014)", category: "Core", purpose: "To promote the basic values and principles governing public administration, regulate conducting business with the State, and establish the Office of Standards and Compliance to ensure compliance with minimum norms and standards." },
  { name: "Preferential Procurement Policy Framework Act, 2000", category: "Core", purpose: "Provides a framework for the implementation of preferential procurement policy." },
  { name: "SITA Act", category: "Core", purpose: "To provide for the establishment of a company that provides information technology, information systems and related services to, or on behalf of, participating departments as an agent of the South African Government." },
  { name: "Occupational Health and Safety Act, 1995 (incl. Covid-19 Health and Safety Directions)", category: "Core", purpose: "Provides a framework for the standards and requirements for workplaces, facilities and employee health and safety." },

  // Topical - not core, but pose a higher impact (financial/reputational) due
  // to heightened stakeholder focus, or new obligations not yet fully controlled.
  { name: "Protection of Personal Information Act (POPIA), 2013", category: "Topical", purpose: "To promote the protection of personal information processed by public and private bodies, establish minimum processing conditions, and provide for an Information Regulator." },
  { name: "Broad-Based Black Economic Empowerment Act (B-BBEE) 53 of 2003", category: "Topical", purpose: "To establish a legislative framework for the promotion of black economic empowerment, empower the Minister to issue codes of good practice, and establish the Black Economic Empowerment Advisory Council." },
  { name: "DPSA Leave Determination Policy (Public Service Act 103 of 1994 / Public Service Regulations 2016)", category: "Topical", purpose: "Provides for human resource management including the regulation of conditions of employment, terms of office, discipline, retirement and discharge of Department staff." },
  { name: "Promotion of Administrative Justice Act 3 of 2000", category: "Topical", purpose: "Gives effect to the right to administrative action that is lawful, reasonable and procedurally fair, and to written reasons for administrative action." },
  { name: "Government Employees Pension Law, 1996 (and 2004 amendment)", category: "Topical", purpose: "Gives effect to the frameworks governing pension fund contributions, management and pay-outs for employees in South Africa." },
  { name: "The Constitution of the Republic of South Africa (Act 108 of 1996)", category: "Topical", purpose: "The mandate of, and environment within which, National, Provincial and Local Government departments and treasuries operate." },
  { name: "Promotion of Access to Information Act (Act 2 of 2000)", category: "Topical", purpose: "Gives effect to the constitutional right of access to information held by the State or by another person where required for the exercise or protection of a right." },
  { name: "Gauteng Tender Board Repeal Act, 2002", category: "Topical", purpose: "Gives effect to new procurement reform initiatives in Gauteng." },

  // Secondary - compliance obligations that apply to the department but are
  // not core to its type of business.
  { name: "Employment Equity Act 55 of 1998", category: "Secondary", purpose: "To provide for employment equity, and for matters incidental thereto." },
  { name: "Basic Conditions of Employment Act 75 of 1997", category: "Secondary", purpose: "To give effect to the right to fair labour practices by establishing and regulating basic conditions of employment." },
  { name: "Labour Relations Act 66 of 1995", category: "Secondary", purpose: "To provide simple procedures for the resolution of labour disputes through statutory conciliation, mediation and arbitration, and accredited independent dispute resolution services." },
  { name: "Skills Development Act 97 of 1998", category: "Secondary", purpose: "To provide an institutional framework to devise and implement strategies to develop and improve workforce skills, integrated within the National Qualifications Framework, including learnerships and a National Skills Fund." },

  // Referenced by specific department risks but not separately listed in the
  // Compliance Universe sheet - added here so it's selectable rather than
  // free-typed, grouped under the Public Service Act framework it derives from.
  { name: "Determination and Directive on the Performance Management and Development System (PMDS) for employees other than SMS, w.e.f. 1 April 2018 (Public Service Act, 103 of 1994)", category: "Core", purpose: "Establishes norms and standards for performance management under section 3 of the Public Service Act, including the conclusion, review and annual assessment of employee Performance Agreements." }
]

export function complianceActByName(name) {
  return COMPLIANCE_UNIVERSE.find(a => a.name === name) || null
}
