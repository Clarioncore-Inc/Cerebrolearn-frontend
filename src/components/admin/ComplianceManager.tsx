"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Shield,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  ArrowLeft,
  Calendar,
  Award,
  FileText,
  Lock,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ComplianceManagerProps {
  onNavigate: (page: string, data?: any) => void;
}

export function ComplianceManager({ onNavigate }: ComplianceManagerProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Load compliance data
  const complianceData = useMemo(() => {
    const psychologists = JSON.parse(localStorage.getItem('psychologists') || '[]');
    const bookings = JSON.parse(localStorage.getItem('psychologist_bookings') || '[]');
    const sessionNotes = JSON.parse(localStorage.getItem('session_notes') || '[]');

    // Add mock licensing and certification data
    const psychologistsWithCompliance = psychologists.map((p: any) => {
      const licenseExpiry = new Date(2025, 11, 31); // Mock expiry date
      const certExpiry = new Date(2026, 5, 30); // Mock cert expiry
      const now = new Date();
      const daysUntilLicenseExpiry = Math.floor((licenseExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const daysUntilCertExpiry = Math.floor((certExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        ...p,
        licenseNumber: `PSY-${Math.floor(Math.random() * 100000)}`,
        licenseState: 'CA',
        licenseExpiry,
        licenseStatus: daysUntilLicenseExpiry > 30 ? 'valid' : daysUntilLicenseExpiry > 0 ? 'expiring' : 'expired',
        certification: 'Board Certified Psychologist',
        certExpiry,
        certStatus: daysUntilCertExpiry > 30 ? 'valid' : daysUntilCertExpiry > 0 ? 'expiring' : 'expired',
        backgroundCheck: {
          status: 'cleared',
          date: new Date(2024, 0, 15),
          nextDue: new Date(2025, 0, 15)
        },
        malpracticeInsurance: {
          provider: 'Professional Liability Insurance Co.',
          policyNumber: `PLI-${Math.floor(Math.random() * 1000000)}`,
          coverage: 1000000,
          expiry: new Date(2025, 11, 31),
          status: 'active'
        },
        hipaaTraining: {
          completed: new Date(2024, 1, 1),
          nextDue: new Date(2025, 1, 1),
          status: 'current'
        },
        continuingEducation: {
          required: 40,
          completed: Math.floor(Math.random() * 50),
          deadline: new Date(2025, 11, 31)
        }
      };
    });

    return {
      psychologists: psychologistsWithCompliance,
      bookings,
      sessionNotes
    };
  }, []);

  // Compliance metrics
  const metrics = useMemo(() => {
    const now = new Date();
    
    const validLicenses = complianceData.psychologists.filter((p: any) => 
      p.licenseStatus === 'valid'
    ).length;
    const expiringLicenses = complianceData.psychologists.filter((p: any) => 
      p.licenseStatus === 'expiring'
    ).length;
    const expiredLicenses = complianceData.psychologists.filter((p: any) => 
      p.licenseStatus === 'expired'
    ).length;

    const validCerts = complianceData.psychologists.filter((p: any) => 
      p.certStatus === 'valid'
    ).length;
    const expiringCerts = complianceData.psychologists.filter((p: any) => 
      p.certStatus === 'expiring'
    ).length;

    const currentHipaa = complianceData.psychologists.filter((p: any) => 
      p.hipaaTraining.status === 'current'
    ).length;
    const expiredHipaa = complianceData.psychologists.filter((p: any) => {
      const daysSince = Math.floor((now.getTime() - new Date(p.hipaaTraining.nextDue).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 0;
    }).length;

    const insuranceActive = complianceData.psychologists.filter((p: any) => 
      p.malpracticeInsurance.status === 'active'
    ).length;

    const ceCompliant = complianceData.psychologists.filter((p: any) => 
      p.continuingEducation.completed >= p.continuingEducation.required
    ).length;

    // Critical issues
    const criticalIssues = complianceData.psychologists.filter((p: any) => 
      p.licenseStatus === 'expired' || 
      p.malpracticeInsurance.status !== 'active' ||
      p.backgroundCheck.status !== 'cleared'
    );

    // Warnings (expiring soon)
    const warnings = complianceData.psychologists.filter((p: any) => 
      p.licenseStatus === 'expiring' || 
      p.certStatus === 'expiring' ||
      (now.getTime() - new Date(p.hipaaTraining.nextDue).getTime()) > 0
    );

    return {
      total: complianceData.psychologists.length,
      validLicenses,
      expiringLicenses,
      expiredLicenses,
      validCerts,
      expiringCerts,
      currentHipaa,
      expiredHipaa,
      insuranceActive,
      ceCompliant,
      criticalIssues,
      warnings,
      complianceRate: complianceData.psychologists.length > 0 
        ? ((validLicenses + currentHipaa + insuranceActive) / (complianceData.psychologists.length * 3)) * 100
        : 0
    };
  }, [complianceData]);

  const exportComplianceReport = () => {
    const report = `
CEREBROLEARN COMPLIANCE REPORT
Generated: ${new Date().toLocaleString()}

========================================
COMPLIANCE OVERVIEW
========================================
Total Psychologists: ${metrics.total}
Overall Compliance Rate: ${metrics.complianceRate.toFixed(1)}%
Critical Issues: ${metrics.criticalIssues.length}
Warnings (Expiring Soon): ${metrics.warnings.length}

========================================
LICENSING STATUS
========================================
Valid Licenses: ${metrics.validLicenses}
Expiring Within 30 Days: ${metrics.expiringLicenses}
Expired: ${metrics.expiredLicenses}

========================================
CERTIFICATIONS
========================================
Valid Certifications: ${metrics.validCerts}
Expiring Within 30 Days: ${metrics.expiringCerts}

========================================
HIPAA TRAINING
========================================
Current Training: ${metrics.currentHipaa}
Expired/Overdue: ${metrics.expiredHipaa}

========================================
MALPRACTICE INSURANCE
========================================
Active Policies: ${metrics.insuranceActive}
Inactive/Expired: ${metrics.total - metrics.insuranceActive}

========================================
CONTINUING EDUCATION
========================================
Compliant (Met Requirements): ${metrics.ceCompliant}
Non-Compliant: ${metrics.total - metrics.ceCompliant}

========================================
CRITICAL ISSUES (IMMEDIATE ACTION REQUIRED)
========================================
${metrics.criticalIssues.length === 0 ? 'None - All clear!' : 
  metrics.criticalIssues.map((p: any) => `
${p.name}
  License Status: ${p.licenseStatus.toUpperCase()}
  Insurance: ${p.malpracticeInsurance.status}
  Background Check: ${p.backgroundCheck.status}
`).join('\n')}

========================================
DETAILED PSYCHOLOGIST COMPLIANCE
========================================
${complianceData.psychologists.map((p: any) => `
${p.name}
  License: ${p.licenseNumber} (${p.licenseState}) - ${p.licenseStatus.toUpperCase()}
    Expires: ${p.licenseExpiry.toLocaleDateString()}
  Certification: ${p.certification} - ${p.certStatus.toUpperCase()}
    Expires: ${p.certExpiry.toLocaleDateString()}
  HIPAA Training: ${p.hipaaTraining.status.toUpperCase()}
    Next Due: ${new Date(p.hipaaTraining.nextDue).toLocaleDateString()}
  Malpractice Insurance: ${p.malpracticeInsurance.status.toUpperCase()}
    Policy: ${p.malpracticeInsurance.policyNumber}
    Coverage: $${p.malpracticeInsurance.coverage.toLocaleString()}
    Expires: ${p.malpracticeInsurance.expiry.toLocaleDateString()}
  Background Check: ${p.backgroundCheck.status.toUpperCase()}
    Last: ${p.backgroundCheck.date.toLocaleDateString()}
    Next: ${p.backgroundCheck.nextDue.toLocaleDateString()}
  Continuing Education: ${p.continuingEducation.completed}/${p.continuingEducation.required} hours
    ${p.continuingEducation.completed >= p.continuingEducation.required ? '✅ COMPLIANT' : '⚠️ INCOMPLETE'}
`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Compliance report exported!');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => onNavigate('admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Portal
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Compliance Manager</h1>
              <p className="text-muted-foreground">
                Track licensing, certifications, and regulatory compliance
              </p>
            </div>
            <Button onClick={exportComplianceReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {metrics.criticalIssues.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>CRITICAL:</strong> {metrics.criticalIssues.length} psychologist(s) have compliance issues requiring immediate attention.
            </AlertDescription>
          </Alert>
        )}

        {metrics.warnings.length > 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> {metrics.warnings.length} credential(s) expiring within 30 days.
            </AlertDescription>
          </Alert>
        )}

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-primary opacity-20" />
                {metrics.complianceRate >= 90 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1">Compliance Rate</p>
              <p className="text-2xl font-bold mb-1">{metrics.complianceRate.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Overall compliance</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FileCheck className="h-8 w-8 text-green-600 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Valid Licenses</p>
              <p className="text-2xl font-bold mb-1">{metrics.validLicenses}</p>
              <p className="text-sm text-muted-foreground">
                {metrics.expiringLicenses} expiring soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Lock className="h-8 w-8 text-blue-600 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">HIPAA Current</p>
              <p className="text-2xl font-bold mb-1">{metrics.currentHipaa}</p>
              <p className="text-sm text-muted-foreground">
                Training up to date
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 opacity-20" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Critical Issues</p>
              <p className="text-2xl font-bold mb-1">{metrics.criticalIssues.length}</p>
              <p className="text-sm text-muted-foreground">
                Require action
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="training">Training & CE</TabsTrigger>
            <TabsTrigger value="critical">Critical Issues</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Licensing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid:</span>
                    <span className="font-semibold text-green-600">{metrics.validLicenses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiring:</span>
                    <span className="font-semibold text-yellow-600">{metrics.expiringLicenses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expired:</span>
                    <span className="font-semibold text-red-600">{metrics.expiredLicenses}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active:</span>
                    <span className="font-semibold text-green-600">{metrics.insuranceActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inactive:</span>
                    <span className="font-semibold text-red-600">{metrics.total - metrics.insuranceActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coverage:</span>
                    <span className="font-semibold">$1M+</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliant:</span>
                    <span className="font-semibold text-green-600">{metrics.ceCompliant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Non-Compliant:</span>
                    <span className="font-semibold text-yellow-600">{metrics.total - metrics.ceCompliant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Required:</span>
                    <span className="font-semibold">40 hrs/yr</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status by Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.psychologists.map((psychologist: any) => {
                    const issues = [];
                    if (psychologist.licenseStatus !== 'valid') issues.push('License');
                    if (psychologist.malpracticeInsurance.status !== 'active') issues.push('Insurance');
                    if (psychologist.hipaaTraining.status !== 'current') issues.push('HIPAA');
                    if (psychologist.continuingEducation.completed < psychologist.continuingEducation.required) issues.push('CE');

                    return (
                      <div key={psychologist.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{psychologist.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            License: {psychologist.licenseNumber} ({psychologist.licenseState})
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {issues.length === 0 ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Compliant
                            </Badge>
                          ) : (
                            <>
                              <Badge variant="destructive">
                                {issues.length} issue{issues.length !== 1 ? 's' : ''}
                              </Badge>
                              <Button size="sm" variant="outline" onClick={() => setSelectedTab('critical')}>
                                <Eye className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Licenses Tab */}
          <TabsContent value="licenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>License Status</CardTitle>
                <CardDescription>Professional licensing compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.psychologists.map((psychologist: any) => (
                    <div key={psychologist.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{psychologist.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {psychologist.licenseNumber} - {psychologist.licenseState}
                          </p>
                        </div>
                        <Badge variant={
                          psychologist.licenseStatus === 'valid' ? 'secondary' :
                          psychologist.licenseStatus === 'expiring' ? 'default' :
                          'destructive'
                        }>
                          {psychologist.licenseStatus === 'valid' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {psychologist.licenseStatus === 'expiring' && <Clock className="h-3 w-3 mr-1" />}
                          {psychologist.licenseStatus === 'expired' && <XCircle className="h-3 w-3 mr-1" />}
                          {psychologist.licenseStatus.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expiration Date</p>
                          <p className="font-semibold">{psychologist.licenseExpiry.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Certification</p>
                          <p className="font-semibold">{psychologist.certification}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insurance Tab */}
          <TabsContent value="insurance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Malpractice Insurance</CardTitle>
                <CardDescription>Professional liability coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.psychologists.map((psychologist: any) => (
                    <div key={psychologist.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{psychologist.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {psychologist.malpracticeInsurance.provider}
                          </p>
                        </div>
                        <Badge variant={psychologist.malpracticeInsurance.status === 'active' ? 'secondary' : 'destructive'}>
                          {psychologist.malpracticeInsurance.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Policy Number</p>
                          <p className="font-semibold">{psychologist.malpracticeInsurance.policyNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Coverage</p>
                          <p className="font-semibold">${(psychologist.malpracticeInsurance.coverage / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expires</p>
                          <p className="font-semibold">{psychologist.malpracticeInsurance.expiry.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>HIPAA Training Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceData.psychologists.map((psychologist: any) => {
                    const now = new Date();
                    const isOverdue = now > new Date(psychologist.hipaaTraining.nextDue);
                    
                    return (
                      <div key={psychologist.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">{psychologist.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Last completed: {psychologist.hipaaTraining.completed.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={isOverdue ? 'destructive' : 'secondary'}>
                            {isOverdue ? 'Overdue' : 'Current'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(psychologist.hipaaTraining.nextDue).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Continuing Education (CE) Hours</CardTitle>
                <CardDescription>Annual requirement: 40 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceData.psychologists.map((psychologist: any) => {
                    const percentage = (psychologist.continuingEducation.completed / psychologist.continuingEducation.required) * 100;
                    const isCompliant = psychologist.continuingEducation.completed >= psychologist.continuingEducation.required;

                    return (
                      <div key={psychologist.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{psychologist.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {psychologist.continuingEducation.completed} / {psychologist.continuingEducation.required} hours
                            </p>
                          </div>
                          <Badge variant={isCompliant ? 'secondary' : 'default'}>
                            {isCompliant ? 'Compliant' : 'In Progress'}
                          </Badge>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              isCompliant ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Critical Issues Tab */}
          <TabsContent value="critical" className="space-y-4">
            {metrics.criticalIssues.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">
                    No critical compliance issues at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              metrics.criticalIssues.map((psychologist: any) => (
                <Card key={psychologist.id} className="border-2 border-red-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-5 w-5" />
                          {psychologist.name}
                        </CardTitle>
                        <CardDescription>
                          CRITICAL: Immediate action required
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="destructive">
                        Contact Provider
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {psychologist.licenseStatus === 'expired' && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>License Expired:</strong> Cannot practice until renewed. Expired on {psychologist.licenseExpiry.toLocaleDateString()}
                        </AlertDescription>
                      </Alert>
                    )}
                    {psychologist.malpracticeInsurance.status !== 'active' && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Insurance Inactive:</strong> No malpractice coverage. Must not see patients.
                        </AlertDescription>
                      </Alert>
                    )}
                    {psychologist.backgroundCheck.status !== 'cleared' && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Background Check Issue:</strong> Cannot practice until resolved.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}