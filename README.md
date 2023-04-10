![latest workflow](https://github.com/digarok/install-appy-pack-action/actions/workflows/main.yml/badge.svg)

# install-appy-pack-action
A Github Action to set up Appy toolchain.


# Example usage
```
    # This will install Appy plus Merlin32 and Cadius on your Github Runner machine
    - name: Install Appy
      uses: digarok/install-appy-pack-action@v0.0.0
      with:
        include_prodos: true
        appy_version:  0.1.7
    
    # Now you can use it to create a new bootable ProDOS disk
    - name: Create Boot Volume
    - run: |
        appy brun
```
