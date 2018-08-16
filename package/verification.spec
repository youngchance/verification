%global debug_package %{nil}
%global __strip /bin/true

Name:           verification
Version:        %{ver}
Release:        %{rel}%{?dist}

Summary:	verification

Group:		SDS
License:	GPL
URL:		http://github.com/journeymidnight
Source0:	%{name}-%{version}-%{rel}.tar.gz
BuildRoot:	%(mktemp -ud %{_tmppath}/%{name}-%{version}-%{release}-XXXXXX)

%description


%prep
%setup -q -n %{name}-%{version}-%{rel}

%build

%install
mkdir -p %{buildroot}/root/.snmp/mibs
mkdir -p %{buildroot}/usr/lib/systemd/system
mkdir -p  %{buildroot}/binaries/verification
mv package/verification.service %{buildroot}/usr/lib/systemd/system
mv JMD-STORAGE-MIB.txt %{buildroot}/root/.snmp/mibs
cp -r *   %{buildroot}/binaries/verification/

#ceph confs ?

%post
systemctl start verification
chkconfig verification on


%preun

%clean
rm -rf %{buildroot}

%files
%defattr(-,root,root,-)
/binaries/verification/*
/usr/lib/systemd/system/verification.service
/root/.snmp/mibs/JMD-STORAGE-MIB.txt

%changelog
